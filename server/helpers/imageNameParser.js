
const parseFileName = (rawFileName) => {
  const parseExp = /T([\d]+)_AT([\d]+)_([A-Za-z])([\d]+)/gi;
  const fileName = rawFileName.split('/').pop();
  const fileExtension = ('' + fileName).split('.').pop();
  let match,
      numeroTelerama,
      numeroAtelier,
      numeroScan,
      typeArticle;
  match = parseExp.exec(fileName);
  // console.log('\n\n', fileName, 'match', match, '\n\n');
  while (match !== null) {
    if (match.length > 3) {
      numeroTelerama = match[1];
      numeroAtelier = match[2];
      numeroScan = match[4] || 1;
      typeArticle = match[3] === 'A' ? 'programme' : 'article';
      return {
        fileName,
        fileExtension,
        numeroTelerama,
        numeroAtelier,
        typeArticle,
        numeroScan
      }
    } else return {
      fileName,
      fileExtension
    }
  }
  return {
    fileName,
    fileExtension
  }

};

export default parseFileName;
