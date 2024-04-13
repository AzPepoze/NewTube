import shutil 
import os.path

# Creating the ZIP file

Chrome_dir = './Chrome'
FireFox_dir = './FireFox'

archived = shutil.make_archive('NT_Chrome', 'zip', Chrome_dir)

GetVersion = None

with open(Chrome_dir+'/manifest.json') as Chromefile:
    lines = Chromefile.readlines()
    if (4 <= len(lines)):
        GetVersion = lines[4 - 1]

def replace_line(filename, line_number, text):
  
  # Open the file and read all the lines from the file into a list 'lines'
  with open(filename) as file:
    lines = file.readlines()
  
  # if the line number is in the file, we can replace it successfully
  if (line_number <= len(lines)):
    
    # Replace the associated line in the list with the replacement text 
    # (followed by a newline \n to end the line), we need to use line_number - 1
    # as the index because lists are zero-indexed in Python.
    lines[line_number - 1] = text
    
    # Open the file in 'writing mode' using the 2nd argument "w", this means 
    # that the file will be made blank, and any new text we write to the file 
    # will become the new file contents.
    with open(filename, "w") as file:

      # Loop through the list of lines, write each of them to the file
      for line in lines:
        file.write(line)
  
  # otherwise if the line number is past the length of the file, we can't 
  # replace the line so output an error message instead
  else:
  
    # Output the line number that was requested to be replaced and the number
    # of lines the file actually has to inform the user
    print("Line", line_number, "not in file.")
    print("File has", len(lines), "lines.")

# Prompt the user for the filename, line number and replacement text

replace_line(FireFox_dir+'/manifest.json', 4, GetVersion)
    
# archived = shutil.make_archive('NT_FireFox', 'zip', FireFox_dir)
