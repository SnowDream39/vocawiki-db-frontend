import axios from 'axios'

interface UserLogin {
  username: string
  password: string
}

interface UserRegister {
  email: string
  password: string
  username: string
}

const api = axios.create({
  baseURL: 'https://api.voca.wiki',
})

// 登录：不再手动存储 access_token，而是依赖后端返回的 Set-Cookie
export const login = async (form: UserLogin) => {
  const data = new URLSearchParams()
  data.append('grant_type', 'password')
  data.append('username', form.username)
  data.append('password', form.password)
  data.append('scope', '')
  data.append('client_id', 'string') // 如果Swagger要求，这里必须写
  data.append('client_secret', '********') // 同上

  const response = await api.post('/auth/jwt-cookie/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    withCredentials: true, // ✅ 让浏览器带上/保存 Cookie
  })

  // 登录后不再手动存 token，直接更新用户信息
  return response.data
}

// 注册：同样启用 withCredentials，注册成功后后端可自动设置 Cookie
export const register = async (form: UserRegister) => {
  const response = await api.post(
    '/user/auth/register',
    {
      email: form.email,
      password: form.password,
      username: form.username,
    },
    { withCredentials: true }, // ✅ 让浏览器保存 Cookie
  )

  return response.data
}
