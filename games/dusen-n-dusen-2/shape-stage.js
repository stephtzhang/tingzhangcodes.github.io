const ORANGE = "#fca503";
const BLUE = "#4287f5";
const GREEN = "#32a852";
const MAGENTA = "#ad3499";
const COLORS = [ORANGE, BLUE, GREEN, MAGENTA];


class ShapeStage {
  constructor(container, width, height, displayIcons=false, downloadCallback=null) {
    this.stage = new Konva.Stage({
      container: container,
      width: width,
      height: height,
    });
    this.shapeLayer = new Konva.Layer();
    this.stage.add(this.shapeLayer);
    this.shapeLayer.zIndex(0);
    this.shapeLayer.id('shape-layer');
    if (displayIcons === true) {
      this.iconLayer = new Konva.Layer();
      this.stage.add(this.iconLayer);
      this.iconLayer.id('icon-layer');
      this.addIcons(height, width, downloadCallback);
    }
    this.stage.on('dblclick dbltap', this.dropShape);
  }

  addIcons(stageHeight, stageWidth, downloadCallback) {
    // https://fontawesome.com/icons/arrow-alt-circle-down?style=solid
    const downloadIcon = 'arrow-alt-circle-down-solid.svg';
    this.addIcon(downloadIcon, stageHeight, stageWidth, downloadCallback)
    // https://fontawesome.com/icons/info-circle?style=solid
    const infoIcon = 'info-circle-solid.svg';
    this.addIcon(infoIcon, stageHeight, stageWidth, toggleInfo, 2)
  }

  addIcon(iconFile, stageHeight, stageWidth, callback, padMultiplier=1) {
    const path = 'https://tngzng.github.io/games/dusen-n-dusen/assets/';
    const dimension = 36;
    const padding = 12;

    Konva.Image.fromURL(`${path}/${iconFile}`, (image) => {
      image.setWidth(dimension);
      image.setHeight(dimension);
      const iconY = stageHeight - image.height() * (2 + padMultiplier) - padding * padMultiplier;
      image.setY(iconY);
      image.setX(stageWidth - image.width() - padding);
      addCursorStyling(image);
      image.on('click tap', callback)
      this.iconLayer.add(image);
      this.stage.add(this.iconLayer);
      this.iconLayer.zIndex(1);
    })
  }

  dropShape(event) {
    var stage = this.getStage();
    const pointerPosition = stage.getPointerPosition();
    const x = pointerPosition.x;
    const y = pointerPosition.y;
    var shape = makeShape(x, y, stage.width());
    var layer = stage.findOne('#shape-layer');
    layer.add(shape);
    stage.add(layer);
    layer.zIndex(0);
  }
}


function toggleInfo(event) {
  var layer = this.getStage().findOne('#info-layer');
  if (layer === undefined) {
    const desktopStyling = (window.innerWidth >= 768);
    layer = new Konva.Layer();
    this.getStage().add(layer);
    layer.id('info-layer');
    const infoText = [
      "Tap twice for new shape.",
      "Drag to move.",
      "Download to save.",
    ]
    var text = new Konva.Text({
      text: infoText.join('\n'),
      fontSize: 18,
      fontStyle: 'bold',
      fontFamily: 'Courier',
      fill: '#141414',
      align: 'center',
      verticalAlign: 'middle',
      horizontalAlign: 'middle',
      height: this.getStage().height(),
      width: this.getStage().width(),
    });
    layer.add(text);
    this.getStage().add(layer)
    layer.zIndex(1);
  } else {
    layer.destroy(); // 💥
  }
}


function addCursorStyling(konvaElement) {
  konvaElement.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  konvaElement.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}


function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}


function makeRandomBox(x, y, stageWidth) {
  return new Konva.Rect({
    x: x,
    y: y,
    width: getRandomInt(stageWidth / 8, stageWidth / 4),
    height: getRandomInt(stageWidth / 8, stageWidth / 4),
    fill: getRandomElement(COLORS),
    draggable: true,
  });
}


function makeRandomPolygon(x, y, stageWidth) {
  return new Konva.RegularPolygon({
    x: x,
    y: y,
    sides: 6,
    radius: getRandomInt(stageWidth / 8, stageWidth / 4),
    fill: getRandomElement(COLORS),
    draggable: true,
  });
}


function makeRandomCircle(x, y, stageWidth) {
  return new Konva.Circle({
    x: x,
    y: y,
    radius: getRandomInt(stageWidth / 8, stageWidth / 4),
    fill: getRandomElement(COLORS),
    draggable: true,
  });
}


function makeShape(x, y, stageWidth) {
  var shapeFuncs = [makeRandomPolygon, makeRandomBox, makeRandomCircle];
  var shapeFunc = getRandomElement(shapeFuncs);
  var shape = shapeFunc(x, y, stageWidth)
  addCursorStyling(shape);

  return shape;
}