const { createCanvas } = require("canvas"); 
  
 const w = 100; 
 const h = 100; 
 const canvas = createCanvas(w, h); 
 const context = canvas.getContext("2d"); 
  
 function getUserAvatar(username) { 
   const text = username.slice(0, 2).toUpperCase(); 
  
   context.fillStyle = "#292929"; 
   context.fillRect(0, 0, w, h); 
   context.font = "128px Menlo"; 
  
   const textWidth = context.measureText(text).width; 
   context.fillStyle = "#fff"; 
   context.fillText(text, (w - textWidth) / 2, (w + 96) / 2); 
  
  
   return canvas.toDataURL(); 
 } 
  
 module.exports = getUserAvatar;
