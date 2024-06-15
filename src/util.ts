import Axios from 'axios'
import {
  initializeAppCheck,
  getToken,
  ReCaptchaV3Provider,
} from 'firebase/app-check'
import { app } from '~/service/firebase'
import { getCookie } from 'react-use-cookie'

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcPWBEkAAAAAGvMehTfPWRw4-yqyAJ9mNg28xRp'),
})

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

export const fetcher = async (url: string) => {
  const Authorization = getCookie('Authorization')
  const appCheckTokenResponse = await getToken(
    appCheck,
    /* forceRefresh= */ false,
  )
  try {
    const { data } = await api.get(url, {
      headers: {
        Authorization: `Bearer ${Authorization}`,
        'X-Firebase-AppCheck': appCheckTokenResponse.token,
      },
    })

    return data.body
  } catch (error: any) {
    return error.response.data
  }
}

export const put = async (url: string, data: object) => {
  const Authorization = getCookie('Authorization')
  const appCheckTokenResponse = await getToken(
    appCheck,
    /* forceRefresh= */ true,
  )

  await api.put(url, data, {
    headers: {
      Authorization: `Bearer ${Authorization}`,
      'X-Firebase-AppCheck': appCheckTokenResponse.token,
    },
  })
}

export const apiUrl = (path: string) =>
  `${import.meta.env.VITE_API_BASE}${path}`
