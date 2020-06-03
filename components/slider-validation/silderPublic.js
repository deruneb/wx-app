function product(width,height,s){
  var time = new Date().getTime(); //时间戳
  var randomNum = ("0000000" + 100000000 * Math.random()).match(/(\d{8})(\.|$)/)[1]; //8位随机数
  var imgSrc,
  arrImage = ['https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/9dcbe349-6fe1-46e3-8596-e672b4926713.jpg','https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/fed2fb0f-26b0-4674-8a5c-d5a372f12b9c.jpg','https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/2cbbcc0d-652f-4d5c-91a8-533a7c8ce9bc.jpg','https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/d4420ca8-fd9f-4b1a-8733-3b4fd3d79349.jpg','https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/775bb1ee-8bc2-48ee-99f7-f7753f476eb5.jpg'];

  var suiji = arrImage[Math.floor((Math.random()*arrImage.length))]
  var n = Math.floor(Math.random() * 3) + 1;
  // imgSrc = `https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/sliderBg0${n}.jpg`;
  imgSrc = suiji;
  var qX = width, qY = height;
  var rX = Math.random() * (qX - 3.5 * s) + 2 * s;
  var rY = Math.random() * (qY - 15 - 25 - s) + 15;
  var data = {
    time: time,
    imgSrc: imgSrc,
    randomNum: randomNum,
    x: rX,
    y: rY
  };
  return data;
}
module.exports ={
product: product  
}