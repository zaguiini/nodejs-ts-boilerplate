declare namespace NodeJS {
  type EnvVars =
    | 'PORT'
    | 'DB_HOST'
    | 'DB_PORT'
    | 'DB_USER'
    | 'DB_PASSWORD'
    | 'DB_NAME'

  type ProcessEnv = {
    [K in EnvVars]: string | undefined
  }
}
