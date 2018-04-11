
## Survey JSON Schema

Surveys are defined using a Json Schema, in order to create a new survey you 
must provide a Json Schema with a correct format.

### JSON Schema format

The Survey Schema Json have the following attributes:

* _`"title"`_: a text with the main title for the survey
* _`"description"`_: a text with a basic description for the survey
* _`"type"`_: a string with the text _`"object"`_
* _`"properties"`_: an object with all the _`fields`_ for the survey
* _`"required"`_: an array with the names of the required fields

The basic format for a survey json object is:
```
{
    "title": "Demo Survey",
    "description": "A simple survey with the base format",
    "type": "object",
    "required": [],
    "properties": {}
}
```

The _`"required"`_ attribute is a list of the names of required fields of the 
survey, for example:
```
    "required": [
        "firstName",
        "lastName",
        "birthdate"
    ]

```

##### Properties

The _`"properties"`_ attribute is an object with every form _`field`_ as attribute, 
for example:
```
    "properties": {
        "firstName": {
            "type": "string",
            "title": {
                "es": "Enter your first name"
            }
        },
        "lastName": {
            "type": "string",
            "title": {
                "es": "Enter your surname"
            }
        },
        "birthdate": {
            "type": "string",
            "title": {
                "es": "Enter your date of birth"
            }
        }
    }

```

##### Required fields

Survey fields are grouped in three groups: personal information, 
socio-economic fields, and indicators.

Personal information fields are:
* _`identificationType`_
* _`identificationNumber`_
* _`firstName`_
* _`lastName`_
* _`birthdate`_
* _`countryOfBirth`_
* _`gender`_
* _`email`_
* _`phoneNumber`_

Socio-economics fields are:
* _`areaOfResidence`_
* _`currency`_
* _`educationClientLevel`_
* _`educationPersonMostStudied`_
* _`employmentStatusPrimary`_
* _`familyUbication`_
* _`householdMonthlyIncome`_
* _`manyPeopleHousehold`_
* _`manyPeopleHouseholdIncome`_
* _`manyPeopleUnder18Household`_
* _`receiveStateIncome`_
* _`housingSituation`_

Indicators are:
* _`income`_
* _`stableIncome`_
* _`accessToCredit`_
* _`familySavings`_
* _`diversifiedSourcesOfIncome`_
* _`documentation`_
* _`stableHousing`_
* _`refrigerator`_
* _`properKitchen`_
* _`electricityAccess`_
* _`safeHouse`_
* _`safeBathroom`_
* _`separateBedrooms`_
* _`comfortOfTheHome`_
* _`regularMeansOfTransportation`_
* _`accessToShopsAndServices`_
* _`phone`_
* _`security`_
* _`clothingAndFootwear`_
* _`insurance`_
* _`regularityOfMeals`_
* _`alimentation`_
* _`nearbyHealthPost`_
* _`personalHygiene`_
* _`sexualHealth`_
* _`eyesight`_
* _`dentalCare`_
* _`vaccinations`_
* _`garbageDisposal`_
* _`unpollutedEnvironment`_
* _`readAndWrite`_
* _`middleEducation`_
* _`knowledgeAndSkillsToGenerateIncome`_
* _`capacityToPlanAndBudget`_
* _`communicationAndSocialCapital`_
* _`schoolSuppliesAndBooks`_
* _`informationAccess`_
* _`entertainmentAndRecreation`_
* _`culturalTraditionsAndHeritage`_
* _`respectForDiversity`_
* _`awarenessOfHumanRights`_
* _`socialCapital`_
* _`influenceInPublicSector`_
* _`registeredToVoteAndVotesInElections`_
* _`abilityToSolveProblemsAndConflicts`_
* _`awarenessOfNeeds`_
* _`selfEsteem`_
* _`moralConscience`_
* _`emotionalIntelligence`_
* _`selfExpression`_
* _`willingnessDesireToDevelopSkillsAndKnowledge`_
* _`householdViolence`_
* _`entrepreneurialSpirit`_
* _`autonomyDecisions`_

`Personal information` fields are required and mandatory, and must be present in 
the survey schema definition. `Socio-economics` fields and `Indicators` are 
recommended and can be customized.

#####Field attributes:

There are common attributes for all fields:

* _`"title"`_: a title for the survey field

```
    "firstName": {
        "type": "string",
        "title": {
            "es": "Enter your first name"
        }
    }
```

* _`"description"`_: a basic description for the survey field
```
    "areaOfResidence": {
        "type": "string",
        "title": {
            "es": "Area of Residence"
        },
        "description": {
            "es": "This is the area you live in"
        }
    }
```

* _`"type"`_: the type of the field, can be: _`"string"`_, _`"number"`_, 
  _`"array"`_, or _`"object"`_
  
`Personal information` and `Socio-economics` fields may be of type _`"string"`_ 
or _`"number"`_, `Indicators` are of type _`"array"`_  

```
    "firstName": {
        "type": "string",
        "title": {
            "es": "Enter your first name"
        }
    }

    "manyPeopleHousehold": {
        "type": "number",
        "title": {
            "es": "How many people are in your household?"
        }
    }
```

* _`"enum"`_ and _`"enumNames"`_: when you define a field of type _`"string"`_ 
    you can predefine options with the attributes _`"enum"`_ and _`"enumNames"`_, 
    _`"enum"`_ are the values and _`"enumNames"`_ are the displaying texts
```
    "identificationType": {
        "type": "string",
        "title": {
            "es": "Personal Reference"
        },
        "enum": [
            "NATIONALINSURANCE",
            "ORGANISATIONALREFERENCENUMBER",
            "OTHER"
        ],
        "enumNames": [
            "National Insurance Number",
            "Organisation Reference Number",
            "Other identification"
        ]
    }
```

* _`"format"`_: a format for having validation in the survey field
    * _`"date"`_: validates the field to be a valid date format 
    * _`"email"`_: validates the field to be a valid email

```
    "birthdate": {
        "type": "string",
        "format": "date",
        "title": {
            "es": "Enter your date of birth"
        }
    }

    "email": {
        "type": "string",
        "format": "email"
        "title": {
            "es": "Enter your email address"
        },
    }
```

* _`"default"`_: a default value for the survey field
```
    "currency": {
        "type": "string",
        "title": {
            "es": "Please enter the currency in which you earn your main income"
        },
        "default": "GBP/Pound Sterling"
    }
```

#####Indicators fields

* _`"array"`_: fields of type _`"array"`_ define _`Indicators`_

    Indicator are defined as properties of type _`"array"`_, which are fields with 
    multiple choices with images, options are defined in the attribute _`"items"`_ 
    which is an object of type _`"object"`_ and has an attribute _`"enum"`_ 
    which is an array of options, every option have attributes _`"url"`_, 
    _`"description"`_, and _`"value"`_, _`"url"`_: a url of an image for the 
    option, _`"description"`_: a text description, and _`"value"`_: is one of the 
    following values _`"GREEN"`_, _`"YELLOW"`_, _`"RED"`_, or _`"NONE"`_. 
    Indicators also have attributes _`"uniqueItems"`_ which is always _`true`_, 
    and _`"default"`_ for defining a default option
```
    "income": {
        "type": "array",
        "title": {
            "es": "Income Above the Poverty Line"
        },
        "description": {
            "es": "We have enough income"
        },
        "items": {
            "type": "object",
            "enum": [
                {
                    "url": "https://s3.eu-west-2.amazonaws.com/py.org.fundacionparaguaya.psp.images/surveys/indicators/1-1.jpg",
                    "description": "Our household income is consistently above 60% of the UK average. (i.e. Single: £9,500. Couple with no children: £14,200. Couple with two children £20,400).",
                    "value": "GREEN"
                },
                {
                    "url": "https://s3.eu-west-2.amazonaws.com/py.org.fundacionparaguaya.psp.images/surveys/indicators/1-2.jpg",
                    "description": "Our household income this year is above 60% of the UK average. (i.e. Single: £9,500. Couple with no children: £14,200. Couple with two children £20,400).",
                    "value": "YELLOW"
                },
                {
                    "url": "https://s3.eu-west-2.amazonaws.com/py.org.fundacionparaguaya.psp.images/surveys/indicators/1-3.jpg",
                    "description": "Our household income is always below 60% of the UK average. (i.e. Single: £9,500. Couple with no children: £14,200. Couple with two children £20,400).",
                    "value": "RED"
                },
                {
                    "url": "NONE",
                    "description": "",
                    "value": "NONE"
                }
            ]
        },
        "uniqueItems": true,
        "default": [
            {
                "url": "https://s3.eu-west-2.amazonaws.com/py.org.fundacionparaguaya.psp.images/surveys/indicators/1-1.jpg",
                "description": "Our household income is consistently above 60% of the UK average. (i.e. Single: £9,500. Couple with no children: £14,200. Couple with two children £20,400).",
                "value": "GREEN"
            }
        ]
    }
```

### UI Schema

The Survey UI Schema is a JSON Schema that describes how fields show be rendered, 
the UI Schema have the following attributes:

* _`"properties"`_: an object that must be empty
* _`"ui:group:personal"`_: an array grouping the personal information fields 
* _`"ui:group:economics"`_: an array grouping the socio-economics fields 
* _`"ui:group:indicators"`_: an array grouping the indicators fields 
* _`"ui:order"`_: an array listing all the fields in the order to be displayed  
* _`"ui:custom:fields"`_: an object defining the types of fields that require 
  custom rendering

The basic format for a survey json object is:
```
{
    "properties": {},
    "ui:group:personal": [],
    "ui:group:economics": [],
    "ui:group:indicators": []
    "ui:order": [],
    "ui:custom:fields": {},
}
```

Custom rendering fields can be: gallery, gmap, date, numberFormat
* _`"date"`_: fields that need a date picker
* _`"numberFormat"`_: fields of numeric format
* _`"gmap"`_: fields that need a map for picking a location
* _`"gallery"`_: indicator fields that display a gallery of images for choosing 
  and option
  
An UI Schema example:
```
{
    "properties": {},
    "ui:custom:fields": {
        "birthdate": {
            "ui:field": "date"
        },
        "householdMonthlyIncome": {
            "ui:field": "numberFormat"
        },
        "familyUbication": {
            "ui:field": "gmap"
        },
        "income": {
            "ui:field": "gallery"
        },
        "stableIncome": {
            "ui:field": "gallery"
        }
    },
    "ui:order": [
        "firstName",
        "lastName",
        "birthdate",
        "areaOfResidence",
        "currency",
        "householdMonthlyIncome",
        "familyUbication",
        "income",
        "stableIncome"
    ],
    "ui:group:personal": [
        "firstName",
        "lastName",
        "birthdate"
    ],
    "ui:group:economics": [
        "areaOfResidence",
        "currency",
        "householdMonthlyIncome"
    ],
    "ui:group:indicators": [
        "income",
        "stableIncome"
    ]
}
```
