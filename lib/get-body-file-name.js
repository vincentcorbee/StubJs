const getBodyFileName = (bodyFileName, match) =>
  bodyFileName.replace(
    /\${\d+}/,
    // Skip the main expression
    sub => match[parseInt(sub.substring(2, sub.length - 1), 10) + 1]
  )

module.exports = getBodyFileName
