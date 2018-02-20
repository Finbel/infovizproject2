import os
import json
from pprint import pprint

def line_prepender(filename, line):
    with open(filename, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write(line.rstrip('\r\n') + content)


countries = [
    "Afghanistan",
    "Algeria" ,
    "Australia" ,
    "Bahrain" ,
    "Belgium" ,
    "Burundi" ,
    "Cameroon" ,
    "Canada" ,
    "Chad" ,
    "Czech Republic" ,
    "Denmark" ,
    "Egypt" ,
    "France" ,
    "Georgia" ,
    "Germany" ,
    "India" ,
    "Iran" ,
    "Iraq" ,
    "Italy" ,
    "Jordan" ,
    "Lebanon" ,
    "Libya" ,
    "Morocco" ,
    "Netherlands" ,
    "Niger" ,
    "Nigeria" ,
    "Norway" ,
    "Pakistan" ,
    "Poland" ,
    "Romania" ,
    "Russia" ,
    "Saudi Arabia" ,
    "Spain" ,
    "Sweden" ,
    "Syria" ,
    "Tajikistan" ,
    "Turkey" ,
    "Turkmenistan" ,
    "United Arab Emirates" ,
    "United Kingdom" ,
    "United States" ,
    "Uzbekistan" ,
    "Yemen" 
]

for filename in os.listdir('.'):
    print(filename)
    if filename != "parser.py" and not filename.startswith("w") and not filename.startswith("back"):
        f = open("w"+filename,"w")
        data = json.load(open(filename))
        copy = []
        added = []
        for d in data:
            i = data.index(d)
            id_value = {
                "id" : d["id"],
                "values" : [x for x in d["values"] if int(x["value"]) != 0]
            }
            if not id_value in added and len(id_value["values"])>0:
                copy.append(id_value)
                added.append(id_value)
        json.dump(copy,f)

for filename in os.listdir('.'):
    if filename.startswith("w"):
        line_prepender(filename, "var " + filename[1:-3] + " = ")

        # for country in list(data):
        #     if not (country in countries):
        #         del data[country]
        #     else:
        #         date_values = []
        #         for year in list(data[country]):
        #             if(len(year) > 4 ):
        #                 del data[country][year]
        #                 continue
        #             elif(not isinstance(data[country][year], str)):
        #                 value = int(data[country][year])
        #                 date_value = {
        #                     "date" :  year,
        #                     "value" : value
        #                 }
        #             else:
        #                 del data[country][year]
        #                 continue
        #             date_values.append(date_value)
        #         date_values = sorted(date_values,key=lambda x: int(x["date"]))
        #         d = {
        #             "id" : country,
        #             "values" : date_values
        #         }
        #         data2.append(d)