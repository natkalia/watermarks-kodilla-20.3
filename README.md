# Text and image watermarks generator :camera:

Simple console project in Node.js using npm packages (jimp, inquirer) created as exercise for Web Developer Bootcamp in Kodilla (Module 20.3). 
It helps generating text/image watermarks on user's images and saving them locally.

# Screenshots

![screen](https://user-images.githubusercontent.com/49140572/79717674-9a370580-82da-11ea-8ad3-31758b3f7fdb.PNG)

# Features

User can add customized text or customized image watermark to his/her image. Images with watermaks are saved locally. In the future it should be possible to modify the image using jimp features.

# How to run

* Download project to your local folder.
* Run `node app.js` or `node app` in your console.

# Supported images formats

* jpg 
* png 
* tiff
* bmp

# TODO's

- [ ] add new feature: app should ask if user wants to edit image, if yes, app should ask (as list) for type of modifications: make image brighter, increase contrast, make image b&w, 
invert image (use inbuilt Jimp methods)
- [ ] refactor so that if path to image (input image or watermark image) does not exist, user should be able to provide new path, instead of exiting the app