export const randomElement = (array) => {
    const word = Math.floor(Math.random()*array.length);
    return array[word];
}