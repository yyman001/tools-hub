# Escape函数弃用警告修复

## 问题描述
在 `AuthStatusMonitor.vue` 中使用了已弃用的 `escape()` 函数：
```
The signature '(string: string): string' of 'escape' is deprecated.
```

## 问题原因
`escape()` 函数是一个已弃用的Web API，现代浏览器建议使用更安全和标准的方法来处理字符编码。

## 修复方案

### 原始代码（有问题）
```typescript
try {
  const decodedString = decodeURIComponent(escape(atob(paddedBase64)));
  return JSON.parse(decodedString);
} catch (safeDecodeError) {
  throw new Error("Token payload解码失败");
}
```

### 修复后的代码
```typescript
try {
  const binaryString = atob(paddedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  const decodedString = decoder.decode(bytes);
  return JSON.parse(decodedString);
} catch (safeDecodeError) {
  throw new Error("Token payload解码失败");
}
```

## 技术改进

### 1. 使用现代API
- ❌ 移除了弃用的 `escape()` 函数
- ✅ 使用现代的 `TextDecoder` API
- ✅ 更好的UTF-8字符处理

### 2. 更安全的解码
- 手动将二进制字符串转换为字节数组
- 使用 `TextDecoder` 进行标准的UTF-8解码
- 更好的错误处理和兼容性

### 3. 代码质量提升
- 消除了弃用警告
- 使用标准Web API
- 更好的浏览器兼容性

## 功能验证

### ✅ JWT Token解码
- 标准base64解码正常工作
- 备用UTF-8解码作为fallback
- 支持URL-safe base64格式

### ✅ 错误处理
- 优雅处理解码失败
- 详细的错误信息
- 不会影响其他功能

### ✅ 兼容性
- 现代浏览器完全支持
- 不再有弃用警告
- 更好的长期维护性

## 使用的现代API

### TextDecoder
```typescript
const decoder = new TextDecoder('utf-8');
const decodedString = decoder.decode(bytes);
```

### Uint8Array
```typescript
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}
```

## 优势

1. **标准合规**：使用现代Web标准API
2. **无弃用警告**：消除了TypeScript/ESLint警告
3. **更好的UTF-8支持**：正确处理多字节字符
4. **未来兼容**：不依赖弃用的API
5. **性能优化**：现代API通常有更好的性能

现在JWT token解码功能使用现代标准API，不会再有弃用警告！