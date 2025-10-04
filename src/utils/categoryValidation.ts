import type { Category, CategoryCreateRequest, CategoryUpdateRequest, CategoryValidation } from '@/types'

/**
 * 验证分类名称
 * @param name 分类名称
 * @returns 验证结果
 */
export function validateCategoryName(name: string): CategoryValidation {
    const errors: string[] = []

    if (!name || !name.trim()) {
        errors.push('分类名称不能为空')
    } else if (name.trim().length < 2) {
        errors.push('分类名称至少需要2个字符')
    } else if (name.trim().length > 50) {
        errors.push('分类名称不能超过50个字符')
    }

    // 检查特殊字符
    const invalidChars = /[<>"/\\|?*]/
    if (invalidChars.test(name)) {
        errors.push('分类名称不能包含特殊字符 < > " / \\ | ? *')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证分类描述
 * @param description 分类描述
 * @returns 验证结果
 */
export function validateCategoryDescription(description?: string): CategoryValidation {
    const errors: string[] = []

    if (description && description.length > 200) {
        errors.push('分类描述不能超过200个字符')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证分类slug
 * @param slug 分类slug
 * @returns 验证结果
 */
export function validateCategorySlug(slug: string): CategoryValidation {
    const errors: string[] = []

    if (!slug || !slug.trim()) {
        errors.push('分类标识符不能为空')
    } else if (slug.length < 2) {
        errors.push('分类标识符至少需要2个字符')
    } else if (slug.length > 50) {
        errors.push('分类标识符不能超过50个字符')
    }

    // 检查slug格式（只允许字母、数字、连字符和下划线）
    const slugPattern = /^[a-zA-Z0-9_-]+$/
    if (!slugPattern.test(slug)) {
        errors.push('分类标识符只能包含字母、数字、连字符和下划线')
    }

    // 不能以连字符开头或结尾
    if (slug.startsWith('-') || slug.endsWith('-')) {
        errors.push('分类标识符不能以连字符开头或结尾')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证排序权重
 * @param sortOrder 排序权重
 * @returns 验证结果
 */
export function validateSortOrder(sortOrder: number): CategoryValidation {
    const errors: string[] = []

    if (!Number.isInteger(sortOrder)) {
        errors.push('排序权重必须是整数')
    } else if (sortOrder < 0) {
        errors.push('排序权重不能为负数')
    } else if (sortOrder > 9999) {
        errors.push('排序权重不能超过9999')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证分类创建请求
 * @param request 创建请求数据
 * @param existingCategories 现有分类数据
 * @returns 验证结果
 */
export function validateCategoryCreateRequest(
    request: CategoryCreateRequest,
    existingCategories: Category[] = []
): CategoryValidation {
    const errors: string[] = []

    // 验证名称
    const nameValidation = validateCategoryName(request.name)
    if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors)
    }

    // 验证描述
    if (request.description) {
        const descValidation = validateCategoryDescription(request.description)
        if (!descValidation.isValid) {
            errors.push(...descValidation.errors)
        }
    }

    // 验证排序权重
    if (request.sortOrder !== undefined) {
        const sortValidation = validateSortOrder(request.sortOrder)
        if (!sortValidation.isValid) {
            errors.push(...sortValidation.errors)
        }
    }

    // 检查父分类是否存在
    if (request.parentId !== undefined && request.parentId !== null) {
        const parentExists = existingCategories.some(cat => cat.id === request.parentId)
        if (!parentExists) {
            errors.push('指定的父分类不存在')
        }
    }

    // 检查同级分类名称是否重复
    const sameLevelCategories = existingCategories.filter(cat => cat.parentId === (request.parentId || null))
    const nameExists = sameLevelCategories.some(cat =>
        cat.name.toLowerCase() === request.name.toLowerCase()
    )
    if (nameExists) {
        errors.push('同级分类中已存在相同名称的分类')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证分类更新请求
 * @param categoryId 要更新的分类ID
 * @param request 更新请求数据
 * @param existingCategories 现有分类数据
 * @returns 验证结果
 */
export function validateCategoryUpdateRequest(
    categoryId: number,
    request: CategoryUpdateRequest,
    existingCategories: Category[] = []
): CategoryValidation {
    const errors: string[] = []

    // 验证名称
    if (request.name !== undefined) {
        const nameValidation = validateCategoryName(request.name)
        if (!nameValidation.isValid) {
            errors.push(...nameValidation.errors)
        }

        // 检查同级分类名称是否重复
        const currentCategory = existingCategories.find(cat => cat.id === categoryId)
        if (currentCategory) {
            const parentId = request.parentId !== undefined ? request.parentId : currentCategory.parentId
            const sameLevelCategories = existingCategories.filter(cat =>
                cat.parentId === parentId && cat.id !== categoryId
            )
            const nameExists = sameLevelCategories.some(cat =>
                cat.name.toLowerCase() === request.name.toLowerCase()
            )
            if (nameExists) {
                errors.push('同级分类中已存在相同名称的分类')
            }
        }
    }

    // 验证描述
    if (request.description !== undefined) {
        const descValidation = validateCategoryDescription(request.description)
        if (!descValidation.isValid) {
            errors.push(...descValidation.errors)
        }
    }

    // 验证排序权重
    if (request.sortOrder !== undefined) {
        const sortValidation = validateSortOrder(request.sortOrder)
        if (!sortValidation.isValid) {
            errors.push(...sortValidation.errors)
        }
    }

    // 验证父分类变更
    if (request.parentId !== undefined) {
        if (request.parentId !== null) {
            // 检查父分类是否存在
            const parentExists = existingCategories.some(cat => cat.id === request.parentId)
            if (!parentExists) {
                errors.push('指定的父分类不存在')
            }

            // 检查层级关系（防止循环引用）
            // 这里需要在运行时导入以避免循环依赖
            try {
                const categoryUtils = await import('./category')
                const hierarchyValidation = categoryUtils.validateCategoryHierarchy(categoryId, request.parentId, existingCategories)
                if (!hierarchyValidation.isValid) {
                    errors.push(...hierarchyValidation.errors)
                }
            } catch (error) {
                errors.push('无法验证分类层级关系')
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 生成分类slug
 * @param name 分类名称
 * @param existingCategories 现有分类数据
 * @returns 唯一的slug
 */
export function generateCategorySlug(name: string, existingCategories: Category[] = []): string {
    // 基础slug生成：转换为小写，替换空格和特殊字符为连字符
    let baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // 移除特殊字符
        .replace(/[\s_-]+/g, '-') // 替换空格、下划线、连字符为单个连字符
        .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符

    // 如果slug为空，使用默认值
    if (!baseSlug) {
        baseSlug = 'category'
    }

    // 检查slug是否已存在，如果存在则添加数字后缀
    let slug = baseSlug
    let counter = 1

    while (existingCategories.some(cat => cat.slug === slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

/**
 * 验证分类删除操作
 * @param categoryId 要删除的分类ID
 * @param categories 所有分类数据
 * @param hasAssociatedTools 是否有关联的工具
 * @returns 验证结果和建议
 */
export function validateCategoryDeletion(
    categoryId: number,
    categories: Category[],
    hasAssociatedTools: boolean = false
): CategoryValidation & { suggestions?: string[] } {
    const errors: string[] = []
    const suggestions: string[] = []

    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
        errors.push('要删除的分类不存在')
        return { isValid: false, errors }
    }

    // 检查是否有子分类
    const hasChildren = categories.some(cat => cat.parentId === categoryId)

    if (hasChildren) {
        suggestions.push('该分类包含子分类，删除时需要选择处理方式：')
        suggestions.push('1. 同时删除所有子分类')
        suggestions.push('2. 将子分类移动到其他父分类')
    }

    // 检查是否有关联工具
    if (hasAssociatedTools) {
        suggestions.push('该分类下有关联的工具，删除前需要：')
        suggestions.push('1. 将工具移动到其他分类')
        suggestions.push('2. 或者确认删除所有关联工具')
    }

    return {
        isValid: errors.length === 0,
        errors,
        suggestions
    }
}