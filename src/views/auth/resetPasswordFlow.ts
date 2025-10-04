// utils/resetPasswordFlow.ts
import { supabase } from '@/lib/supabase'

export interface ResetPasswordResult {
  success: boolean
  message: string
}

export async function resetPasswordFlow(newPassword: string): Promise<ResetPasswordResult> {
  try {
    // 1. 解析 URL hash 中的参数
    const hash = window.location.hash.substring(1)
    if (!hash) {
      return { success: false, message: 'URL 中没有 token，请重新申请密码重置' }
    }

    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token') || ''
    const refreshToken = params.get('refresh_token') || undefined
    const type = params.get('type') || ''

    if (!accessToken) {
      return { success: false, message: '没有找到 access_token，请重新申请密码重置' }
    }

    if (type !== 'recovery') {
      return { success: false, message: `token 类型错误 (${type})，请重新申请密码重置` }
    }

    // 2. 设置 Supabase 会话
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError) {
      return { success: false, message: '设置会话失败：' + sessionError.message }
    }

    // 3. 更新用户密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return { success: false, message: '更新密码失败：' + updateError.message }
    }

    // 4. 清理 URL，避免泄露 token
    window.history.replaceState({}, document.title, window.location.pathname)

    return { success: true, message: '密码更新成功！' }
  } catch (err: any) {
    return { success: false, message: '重置密码异常：' + err.message }
  }
}
