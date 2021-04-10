# Author: Michael Carter
# 20-01-07

""" WINDOWS shell commands """
# cd X:\Computer-Science\GitHub\Art-Translate\3-AutoML-CSV
# set GOOGLE_APPLICATION_CREDENTIALS=X:\Computer-Science\GitHub\Art-Translate\3-AutoML-CSV\art-translate-testing-b921ae47d69e.json
""" WINDOWS powershell commands """
# cd X:\Computer-Science\GitHub\Art-Translate\3-AutoML-CSV
# $env:GOOGLE_APPLICATION_CREDENTIALS="X:\Computer-Science\GitHub\Art-Translate\3-AutoML-CSV\art-translate-testing-b921ae47d69e.json"
""" MAC/LINUX shell commands """
# cd Documents/GitHub/4-Art-Translate/3-AutoML-CSV
# export GOOGLE_APPLICATION_CREDENTIALS="/Users/Michael/Documents/GitHub/Art-Translate/3-AutoML-CSV/art-translate-testing-b921ae47d69e.json"

# python automl_script_symbols.py

from google.cloud import storage
import csv

"""
prints a progress bar to be used for every iteration of a long loop
"""
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str)
    """
    #percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    fraction = str(iteration) + '/' + str(total)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {fraction} {suffix}', end = printEnd)


"""
given a blob name (directory in art_translate_1 image bucket), returns the first
folder in the directory name, which is the movement associated with an image
e.g. get_movement("cubism/art_image.png") = "cubism"
"""
def get_movement(blobname):
    for l in range(0, len(blobname)): # search the filepath
        if blobname[l] == '/':       # for a '/' delimiter
            return blobname[:l]     # return the

"""
given a bucket of folders, each representing an art movement and containing
AutoML images associated with said movement, returns a dictionary that
contains movement titles as keys and the number of images in that movement
as values
"""
def create_movement_size_dict():

    total_image_count = 0                    # progress bar stuff ------------------------
    l = 61578                               #
    print("Calculating movement sizes...") #
    printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = '', length = 50)

    movement_size_dict = {} # empty movement:size dictionary
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file

    blobs = storage.Client().list_blobs("art_translate_1") # get all filepaths in the GCP bucket
    for blob in blobs:                                    # and loop through every file path

        movement_name = get_movement(blob.name)                       # get movement of current image
        if (movement_name != prev_movement):                         # if we have started a new movement:
            if (prev_movement != ""):                               #    / check that one was just completed
                movement_size_dict[prev_movement] = movement_count #     \ and if so update the dictionary.
            prev_movement = movement_name                         # update the previous movement to current one
            movement_count = 0                                   # and reset the movement image count

        movement_count += 1 # add 1 to the number of images in current movement

        total_image_count += 1 # update image count and print the updated progress bar
        printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = '', length = 50)

    movement_size_dict[prev_movement] = movement_count # add the key:value pair of the last movement

    return movement_size_dict

"""
given a filename, writes the header of a .csv file to be used by Google AutoML
to determine training, validation, and test datasets for a new Art Translate
movement detection model
"""
def write_csv_header(filename):

    with open(filename, mode='w', encoding='utf-8') as csv_file: # set the header
        fieldnames = ['set', 'image_path', 'label']                         # to identify the 3
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)           # fields AutoML
        writer.writeheader()                                              # expects to read

"""
given a list of values, writes them into a new line of a .csv file that is
formatted according to the description in the method above
"""
def write_csv_line(filename, csv_list):

    with open(filename, mode='a', encoding='utf-8') as csv_file: # write image data to new line of .csv
        writer = csv.DictWriter(csv_file, fieldnames=['set', 'image_path', 'label'] )
        writer.writerow({'set': csv_list[0], 'image_path': csv_list[1], 'label': csv_list[2]})
"""
writes every image in art_translate_images into a .csv file
formatted to file Google AutoML's specifications:
dataset, google cloud directory, label
"""
def write_csv_file(filename, pct_train, pct_valid):

    write_csv_header(filename) # write the header of the .csv file

    movement_size_dict = create_movement_size_dict() # get the number of images in each movement
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file

    off_limits = ['academicism', 'art-deco', 'art-nouveau-modern', 'cubism', 'dada',   # these movements will not
                  'expressionism', 'fauvism', 'impressionism', 'post-impressionism',  # be included, as they do not
                  'realism', 'romanesque', 'romanticism', 'surrealism', 'symbolism'] # contain detectable symbols

    total_image_count = 0             # progress bar stuff -------------------------------------------
    l = 61578                        #
    print("\nWriting .csv file...") #
    printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = 'lines written', length = 50)

    blobs = storage.Client().list_blobs("art_translate_1") # get all filepaths in the GCP bucket
    for blob in blobs:                                    # and loop through every file path

        movement_name = get_movement(blob.name)       # get movement of current image

        if (movement_name != prev_movement):         # if we have started a new movement,
            prev_movement = get_movement(blob.name) # update the previous movement to current one
            movement_count = 0                     # and reset the movement image count

        num_images = movement_size_dict[movement_name] # number of images in current movement
        num_train = int((pct_train/100) * num_images) # convert percentages
        num_valid = int((pct_valid/100) * num_images) # to integer counts

        if movement_count in range(0, num_train):                         # .csv 0 -- dataset
            dataset = "TRAIN"                                            #     assign images to
        elif movement_count in range(num_train, num_train + num_valid): #     TRAIN, VALIDATE, or TEST
            dataset = "UNASSIGNED"                                     #     datasets according to the
        else:                                                         #     percentages set above
            dataset = "TEST"                                         #
        directory = "gs://art_translate_1/" + blob.name             # .csv 1 -- google cloud directory
        label = movement_name                                      # .csv 2 -- AutoML classification label

        csv_list = [dataset, directory, label] # create list of values for next line of .csv file
        movement_count += 1                   # increment the number of images in current movement

        if movement_name not in off_limits:     # if we want to train for the current movement,
            write_csv_line(filename, csv_list) # write the values to a new line of the file and

        total_image_count += 1 # update image count and print the updated progress bar
        printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = 'lines written', length = 50)
    print()
    print("Look for", filename, "in the parent directory.")

"""
WHERE THE MAGIC HAPPENS ===========================================================================
"""
filename = 'automl_training_data.csv' # output filename
percent_training   = 80   # here the percentage splits
percent_validation = 10  # for training, validation, and
percent_testing    = 10 # test sets can be adjusted

write_csv_file(filename, percent_training, percent_validation)