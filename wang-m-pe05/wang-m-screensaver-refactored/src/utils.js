export const getRandomInt = (min, max) =>  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomColor = (ctx) => {
    const getByte = () => {
        return 85 + Math.round(Math.random() * 200);
    }
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
}