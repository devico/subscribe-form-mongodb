let range = (from, to) => {
  return Array(to).fill(null).map((_, i) => i)
}

let chunkify = (arr, len) => {
  return range(0, Math.ceil(arr.length / len)).map((el, i) => arr.slice(i * len, i * len + len))
}

module.exports = {
	range,
	chunkify
}