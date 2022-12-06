const axios = require('axios')
const token = require('./token')


const refreshToken = async () => {
  try {
    const res = await axios({
      method: 'post',
      url: 'https://api.flyseries.in/auth/refresh',
      headers: {
        Authorization: 'Bearer ' + parsedToken.refresh_token
      }
    })
    token.token.fsAccessToken = res.data.access_token
    token.token.fsRefreshToken = res.data.refresh_token
    return true;
  } catch (error) {
    return error
  }
}

const getToken = async () => {
  try {
    const res = await axios({
      method: 'post',
      url: 'https://api.flyseries.in/auth/local/signin',
      data: {
        "phone": process.env.PHONE,
        "password": process.env.PASSWORD
      }
    })
    token.token.fsAccessToken = res.data.data.tokens.access_token
    token.token.fsRefreshToken = res.data.data.tokens.refresh_token
    return true;
  } catch (error) {
    return error
  }
}

module.exports = { refreshToken, getToken }