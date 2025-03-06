// validate.js
const SQL_SAFE_REGEX = /^[a-zA-Z0-9_\-@. ]+$/

export function validateRequestBody(req) {
  if (!req.is('application/json')) {
    throw new Error('Invalid content type: must be JSON')
  }
  if (typeof req.body !== 'object' || req.body === null) {
    throw new Error('Request body must be a JSON object')
  }

  // 内容校验（防止SQL注入）
  Object.values(req.body).forEach((value) => {
    if (typeof value === 'string' && !SQL_SAFE_REGEX.test(value)) {
      throw new Error('Invalid characters detected in input')
    }
  })
}

export function validateEnv(req, envConfig) {
  const selectedEnv = req.body.env
  if (!envConfig.some((env) => env.name === selectedEnv)) {
    throw new Error('Invalid environment')
  }
}

export function validateFields(req, allowedFields) {
  const invalidFields = Object.keys(req.body)
    .filter((field) => field !== 'env')
    .filter((field) => !allowedFields.includes(field))
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
  }
}
