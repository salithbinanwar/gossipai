export const isValidURL = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export const isValidJson = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (_) {
    return false
  }
}
