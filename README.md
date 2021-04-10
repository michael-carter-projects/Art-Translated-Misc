# Art-Translated Movement Detection
[Python] This repo contains various code I have written as I attempt to use Google AutoML Vision to train a model that predicts the art movement associated with a given piece of art. At the very least, I hope to incoporate this model locally (as a .tflite) into a cross-platform app, but depending on the usefulness of the prediciton model, it may be incorporated into a larger app called "Art Translated" that is being developed by another team.


**Repository Directory:**

**1-Proof-of-Concept**
    
    The purpose of this program is to show that a cloud-deployed Google AutoML model can be used to predict
    the art movement associated with a given image of a painting. The user is asked to choose a file from
    the "test_images" folder. The image selected will be passed to the most recently trained AutoML movement
    detection model, and the result will be returned as a string. This string is mapped to database entries
    which contain the name and brief description of the movement with the highest score.

    include file directory when you have time and update file/ml model names.

**2-WikiArt-Image-Download**

    The purpose of this program is to collect images to use as training data in Google AutoML for the purposes
    outlined above. It does this by scraping images from WikiArt by movement. The images need to be sorted by
    movement, so the script also places them into appropriately named folders on the machine running it. The
    two files included in the repo are the script itself and a screenshot of the console output. Running this
    script once downloaded, named, and sorted by movement over 50,000 images.
    
    wikiart-script.py - downloads, names, and sorts images
    wikiart-output.png - screenshot of console output

**3-AutoML-CSV-Write**

    This program is used as a map between the dataset collected in Part 1 and Google AutoML. Given the file
    directory of the training images, this script creates the .csv file containing the training data (with a
    80:10:10 train:validation:test split) that AutoML needs to actually train a model.
    
    automl_script_symbols.py - the script that writes the .csv (symbols because the .csv only contains
    training data for movements that contain symbols)
    
    automl_training_data.csv - the file that was used to train the latest AutoML model.
    

**4-Movement-Detector-App**

    This is the beginning of a cross-platform app that will hopefully use a local .tflite model created by
    AutoML to predict the movement of an image provided by the user either through the camera roll or by
    taking a picture. For now it is a navigable app that can select an image from a camera roll or take one
    with a camera, but it has no Tensorflow functionality. Provided the dependency issues between Expo and
    Tensorflow are surmountable, I will be implementing the primary functionality in the summer of 2021.

    art-movement-detector/App.tsx    - the file that handles navigation through the app (react-navigation)
    art-movement-detector/components - folder that contains the .js files responsible for each page of the app

**5-Coat-of-Arms-Idenitifier**

    This is a more hands-on machine learning project that will attempt to determine the best machine learning
    model to classify an image of a coat of arms. I will first be turning 35 images into XXX images by running
    each of them through multiple permutations of filters (using Python Pillow), then I will be using YYY to
    run said images through a Multi-Layer Perceptron, a blahblahblah, and a Convolutional Nerual Network. If
    any of them can classify with any usable precision, I may add this to the Movement Detection app. It would
    likely be offered as an extra layer of analysis if a requisite movement is detected.
   
    coat-of-arms_images - file folder containing images sorted by class (in this case, class is the family associated with the coat of arms)
    img_src.txt         - the sources of the original images
    pp.py               - pre-processing script that takes each image and runs it through the different filters
   