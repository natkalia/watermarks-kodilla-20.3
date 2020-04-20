const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const addTextWatermarkToImage = async (inputFile, outputFile, text) => {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
    console.log('Great, your image has now a new text watermark!');
    startApp();
  }
  catch(error) {
    console.log('Something went wrong... Try again!')
  }
};

const addImageWatermarkToImage = async (
  inputFile,
  outputFile,
  watermarkFile
) => {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
    console.log('Great, your image has now a new image watermark!');
    startApp();
  } catch(error) {
    console.log('Something went wrong... Try again!')
  };
};

// helper function to customize output name
const prepareOutputFilename = filename => {
  const [name, ext] = filename.split('.');
  return `${name}-with-watermark.${ext}`;
};

const startApp = async () => {
  // ask if user is ready
  const answer = await inquirer.prompt([
    {
      name: 'start',
      message:
        `Hi! Welcome to 'Watermark manager'! 
        You can exit anytime by clicking Ctrl+C (in most cases).
        Copy your image files to '/img' folder. 
        Then you'll be able to use them in the app. 
        Are you ready?`,
      type: 'confirm',
    },
  ]);

  // if answer is no, just quit the app
  if (!answer.start) { 
    console.log('You are not ready, app will be closed.');
    process.exit();
  }

  // if answer is yes, ask about input file and watermark type
  const input = await inquirer.prompt([
    {
      name: 'inputImage',
      type: 'input',
      message: 'What file do you want to mark?',
      default: 'test.jpg',
    },
  ]);

  // check if file provided by user exists
  if (fs.existsSync('./img/' + input.inputImage)) {
    // console.log('The path exists.');
  } else {
    console.log('The path does not exist. App will be closed.');
    process.exit();
  }

  // if file exists, ask about watermark type
  const watermark = await inquirer.prompt([{
    name: 'watermarkType',
    type: 'list',
    choices: ['Text watermark', 'Image watermark'],
  }]);
  
  // ask user to provide source of text / image watermark
  if (watermark.watermarkType === 'Text watermark') {
    const text = await inquirer.prompt([
      {
        name: 'value',
        type: 'input',
        message: 'Type your watermark text:',
      },
    ]);
    watermark.watermarkText = text.value;
    addTextWatermarkToImage(
      './img/' + input.inputImage,
      './img/' + prepareOutputFilename(input.inputImage),
      watermark.watermarkText
    );
  } else if (watermark.watermarkType === 'Image watermark'){
    const image = await inquirer.prompt([
      {
        name: 'filename',
        type: 'input',
        message: 'Type your watermark name:',
        default: 'logo.png',
      },
    ]);

    // check if file provided by user exists
    if (fs.existsSync('./img/' + image.filename)) {
      // console.log('The path exists.');
      watermark.watermarkImage = image.filename;
      addImageWatermarkToImage(
        './img/' + input.inputImage,
        './img/' + prepareOutputFilename(input.inputImage),
        './img/' + watermark.watermarkImage
      );
    } else {
      console.log('The path does not exist. App will be closed.');
      process.exit();
    }
  }
};

startApp();