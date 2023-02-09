export function upperFirstCase(str: string) {
  let firstCase = str[0].toUpperCase()
  return firstCase + str.substr(1)
}

