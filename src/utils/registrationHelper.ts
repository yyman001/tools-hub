// 注册辅助工具

import { supabase } from '@/lib/supabase'

/**
 * 检查邮箱是否已注册但未验证
 */
export const checkEmailRegistrationStatus = async (email: string) => {
  try {
    // 尝试重新发送验证邮件来检查状态
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      // 如果错误是因为用户已经验证，返回相应状态
      if (error.message?.includes('already confirmed')) {
        return {
          exists: true,
          verified: true,
          message: '该邮箱已注册并验证，请直接登录'
        }
      }
      
      // 如果是其他错误，可能邮箱不存在
      return {
        exists: false,
        verified: false,
        message: '邮箱未注册'
      }
    }

    // 如果成功重发，说明邮箱已注册但未验证
    return {
      exists: true,
      verified: false,
      message: '验证邮件已重新发送'
    }
  } catch (error) {
    console.error('检查邮箱状态失败:', error)
    return {
      exists: false,
      verified: false,
      message: '检查失败'
    }
  }
}

/**
 * 智能处理注册请求
 * 如果用户已存在但未验证，自动重发验证邮件
 */
export const smartRegister = async (username: string, email: string, password: string) => {
  try {
    // 首先尝试正常注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) {
      // 如果是用户已存在的错误，尝试重发验证邮件
      if (error.message?.includes('User already registered')) {
        console.log('用户已存在，尝试重发验证邮件')
        
        const resendResult = await supabase.auth.resend({
          type: 'signup',
          email: email
        })

        if (resendResult.error) {
          if (resendResult.error.message?.includes('already confirmed')) {
            return {
              success: false,
              message: '该邮箱已注册并验证，请直接登录',
              shouldLogin: true
            }
          }
          return {
            success: false,
            message: '重发验证邮件失败：' + resendResult.error.message
          }
        }

        return {
          success: true,
          message: '验证邮件已重新发送到您的邮箱',
          needsVerification: true,
          email: email,
          isExistingUser: true
        }
      }

      return {
        success: false,
        message: error.message
      }
    }

    // 正常注册成功的处理
    if (data.user) {
      if (data.session) {
        return {
          success: true,
          message: '注册成功',
          needsVerification: false,
          user: data.user,
          session: data.session
        }
      } else {
        return {
          success: true,
          message: '注册成功，请检查您的邮箱进行验证',
          needsVerification: true,
          email: data.user.email,
          isExistingUser: false
        }
      }
    }

    return {
      success: false,
      message: '注册失败，请重试'
    }
  } catch (error: any) {
    console.error('智能注册失败:', error)
    return {
      success: false,
      message: error.message || '网络错误，请检查网络连接'
    }
  }
}

/**
 * 格式化邮箱验证状态消息
 */
export const getVerificationStatusMessage = (user: any) => {
  if (!user) return '用户信息不存在'
  
  if (user.email_confirmed_at) {
    return '邮箱已验证'
  }
  
  if (user.confirmation_sent_at) {
    const sentTime = new Date(user.confirmation_sent_at)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - sentTime.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) {
      return '验证邮件刚刚发送'
    } else if (diffMinutes < 60) {
      return `验证邮件已发送 ${diffMinutes} 分钟前`
    } else {
      const diffHours = Math.floor(diffMinutes / 60)
      return `验证邮件已发送 ${diffHours} 小时前`
    }
  }
  
  return '未发送验证邮件'
}