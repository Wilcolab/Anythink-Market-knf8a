const getUserAvatar = (username) =>{
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const size = 100

    const text = username.slice(0,2).toUpperCase()
    context.fillStyle = "#292929";
    context.fillRect(0, 0, size, size);
    context.font = "128px Menlo";

    const textWidth = context.measureText(text).width;
    context.fillStyle = "#fff";
    context.fillText(text, (size - textWidth) / 2, (size + 96) / 2);

    // const regx = /^data:.+\/(.+);base64,(.*)$/

    return canvas.toDataURL('image/png');
}

export default getUserAvatar