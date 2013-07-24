if (typeof window == 'undefined') window = {} // testing outside of browser

// forces selection of shape keys. Don't delete, just make empty
var forceShapeKeys = [ 'hasEqualSides', 'orderRotationalSymmetry' ]

window.bl = window.bl || {};
window.bl.contentService = {
  tools: {},
  question: function(opts) {
    var tool = opts.tool
    if (typeof tool != 'string') throw new Error('tool must be specified')
    if (typeof this.tools[tool] == 'undefined') throw new Error('tool not supported')
    return this.tools[tool].question(opts)
  }
}

window.bl.contentService.tools.sorting = {
  setDefinitions: {
    shape: {
      options: [
        {
          name: "scalene_triangle",
          regular: false,
          orderRotationalSymmetry: 1,
          numAngles: 3,
          numSides: 3,
          numSidesShapeName: 'triangle',
          hasEqualSides: false,
          pairsParallelSides: 0
        },
        {
          name: "isosceles_triangle",
          regular: false,
          orderRotationalSymmetry: 1,
          numAngles: 3,
          numSides: 3,
          numSidesShapeName: 'triangle',
          hasEqualSides: true,
          pairsParallelSides: 0
        },
        {
          name: "equilateral_triangle",
          regular: false,
          orderRotationalSymmetry: 3,
          numAngles: 3,
          numSides: 3,
          numSidesShapeName: 'triangle',
          hasEqualSides: true,
          pairsParallelSides: 0
        },
        {
          name: "square",
          regular: true,
          orderRotationalSymmetry: 4,
          numAngles: 4,
          numSides: 4,
          numSidesShapeName: 'quadrilateral',
          hasEqualSides: true,
          pairsParallelSides: 2
        },
        {
          name: "rectangle",
          regular: false,
          orderRotationalSymmetry: 2,
          numAngles: 4,
          numSides: 4,
          numSidesShapeName: 'quadrilateral',
          hasEqualSides: true,
          pairsParallelSides: 2
        },
        {
          name: "trapezium",
          regular: false,
          orderRotationalSymmetry: 1,
          numAngles: 4,
          numSides: 4,
          numSidesShapeName: 'quadrilateral',
          hasEqualSides: false,
          pairsParallelSides: 2
        },
        {
          name: "kite",
          regular: false,
          orderRotationalSymmetry: 1,
          numAngles: 4,
          numSides: 4,
          numSidesShapeName: 'quadrilateral',
          hasEqualSides: true,
          pairsParallelSides: 2
        }
      ],
      label: function (property, value, negation) {
        switch (property) {
          case 'name':
            var friendly = tvalue.replace(/\_/ig, ' ')
            return !negation 
              ? friendly
              : 'not a ' + friendly
          case 'regular':
            return negation != value
              ? 'regular'
              : 'irregular'
          case 'orderRotationalSymmetry':
            return value === 1
              ? (!negation 
                ? 'no rotational symmetry'
                : 'has rotational symmetry')
              : (!negation
                ? 'rotational symmetry order ' + value
                : 'not rotational symmetry order ' + value)
          case 'numAngles':
            return !negation 
              ? value + ' angles'
              : 'not ' + value + ' angles'
          case 'numSides':
            return !negation 
              ? value + ' sides'
              : 'not ' + value + ' sides'
          case 'numSidesShapeName':
            return !negation 
              ? value
              : 'not a ' + value
          case 'hasEqualSides':
            return !negation 
              ? 'equal sides'
              : 'no equal sides'
          case 'pairsParallelSides':
            return !negation 
              ? value + ' pair' + (value == 1 ? '' : 's') + ' parallel sides'
              : 'not ' + value + ' pair' + (value == 1 ? '' : 's') + ' parallel sides'
        }
      },
      sprite: function(shape) {
        var colours = {
          charcoal: { r: 35, g: 35,   b: 35,   a: 255 }
        }
        var colour = pickRandomProperty(colours)
        colour = colours[colour];

        var layers = [
          {
            filename: 'blank_card',
            width: 86,
            height: 83,
            position: { x: 42, y: 42 }
          },
          {
            shape: shape.name,
            color: colour,
            width: 86,
            height: 83,
            position: { x: -10, y: 86 }
          }
        ]
        return layers
      }
    },
    creature: {
      params: [
        {
          key: 'eyes',
          values: [ 1, 2, 3 ],
          label: function(value) {
            return value == 1
              ? 'Has 1 eye'
              : 'Has ' + value + ' eyes'
          },
          negationLabel: function(value) {
            return value == 1
              ? 'Does not have 1 eye'
              : 'Does not have ' + value + ' eyes'
          }
        },
        {
          key: 'legs',
          values: [ 2, 3, 4 ],
          label: function(value) {
            return value == 1
              ? 'Has 1 leg'
              : 'Has ' + value + ' legs'
          },
          negationLabel: function(value) {
            return value == 1
              ? 'Does not have 1 leg'
              : 'Does not have ' + value + ' legs'
          }
        },
        {
          key: 'colour',
          values: [ 'red', 'yellow', 'green', 'blue', 'pink' ],
          label: function(value) {
            return 'Is ' + value //value.slice(0,1).toUpperCase() + value.slice(1)
          },
          negationLabel: function(value) {
            return 'Is not ' + value //value.slice(0,1).toUpperCase() + value.slice(1)
          }
        },
        {
          key: 'horn',
          values: [ true, false ],
          label: function(value) {
            return value
              ? 'Has horns'
              : 'Does not have horns'
          },
          negationLabel: function(value) {
            return value
              ? 'Does not have horns'
              : 'Has horns'
          }
        }
      ],
      sprite: function(creature) {
        var colour = ({
          red:    { r: 231, g: 0,   b: 0,   a: 255 },
          yellow: { r: 247, g: 204, b: 0,   a: 255 },
          green:  { r: 0,   g: 183, b: 0,   a: 255 },
          blue:   { r: 0,   g: 170, b: 234, a: 255 },
          pink:   { r: 225, g: 116, b: 172, a: 255 }
        })[creature.colour]

        var layers = [
          {
            color: colour,
            width: 60,
            height: 70,
            position: { x: 10, y: 10 }
          },
          {
            filename: 'mask_legs_' + creature.legs,
            width: 86,
            height: 83,
            position: { x: 42, y: 42 }
          },
          {
            filename: 'eyes_' + creature.eyes,
            width: 86,
            height: 83,
            position: { x: 42, y: 42 }
          }
        ]
        if (creature.horn) {
          layers.push({
            filename: 'horns',
            width: 86,
            height: 83,
            position: { x: 42, y: 42 }
          })
        }
        return layers
      }
    }
  },
  setTemplates: {
    keyValue: 
      ("<set>\
        <bvar><ci>x</ci></bvar>\
        <condition>\
          <apply>\
            <eq/>\
            <apply>\
              <property/>\
              <ci>x</ci>\
              <key>{key}</key>\
            </apply>\
            <{mathmlValueType}>{value}</{mathmlValueType}>\
          </apply>\
        </condition>\
      </set>").replace(/\s*/g, '')
  },
  question: function(opts) {
    if (typeof this.modes[opts.toolMode] != 'function') throw new Error('tool mode not supported')

    var question = {
      tool: 'sorting',
      toolMode: opts.toolMode,
      setCategory: opts.setCategory,
      numSets: opts.numSets,
      autoreject: true,
      symbols: {
        sets: {},
        set_members: {},
        lists: {
          unclassified: {
            definitionURL: 'local://symbols/lists/unclassified',
          }
        }
      },
      completionEvaluation: ('\
        <apply>\
          <cardinality/>\
          <csymbol definitionURL="local://symbols/lists/unclassified"/>\
          <cn>0</cn>\
        </apply>').replace(/\s*</g, '<')
    }

    this.modes[opts.toolMode](question)
    
    // randomise set members order and populate unclassified list
    var members = Object.keys(question.symbols.set_members).map(function(id) {
      return question.symbols.set_members[id]
    })
    var randomOrderedMembers = []
    while (members.length) {
      randomOrderedMembers.push(
        members.splice(randomArrayIndex(members), 1)[0]
      )
    }
    question.symbols.lists.unclassified.mathml =
      '<list><members>' +
      randomOrderedMembers
        .map(function(member) { return '<csymbol definitionURL="' + member.definitionURL + '" />' })
        .join('') +
      '</members></list>'

    // set question state
    question.state =
      '<state>' +
      '<csymbol definitionURL="local://symbols/lists/unclassified" />' +
      Object.keys(question.symbols.sets)
        .map(function(id) { return '<csymbol definitionURL="' + question.symbols.sets[id].definitionURL + '" />' })
        .join('') +
      '</state>'

    return question
  },
  modes: {
    // autoreject, random properties, 3 sets, all combinations intersect
    venn: function(question) {
      if (question.setCategory != 'creature') throw new Error('Set type not supported')
      if (question.numSets != 3) throw new Error('invalid number of sets')

      var sortingContent = window.bl.contentService.tools.sorting
      var params = sortingContent.setDefinitions[question.setCategory].params

      // create sets - N.B. random params and random values
      var sets = []
      var paramIndices = params.map(function(p, i) { return i })
      while (sets.length < question.numSets) {
        var ix = randomArrayIndex(paramIndices)
        var param = params[paramIndices[ix]]
        paramIndices.splice(ix, 1)

        var setDefinition = {
          key: param.key,
          value: randomArrayElement(param.values),
        }
        setDefinition.mathmlValueType = ({
          'boolean' : 'boolean',
          'number': 'cn',
          'string': 'string'
        })[ typeof setDefinition.value ]
        sets.push(setDefinition)

        var mathml = sortingContent.setTemplates.keyValue.replace(/{(.*?)}/g, function(match, pattern) {
          return setDefinition[pattern]
        })

        var id = 'set' + (sets.length - 1)
        question.symbols.sets[id] = {
          definitionURL: 'local://symbols/sets/' + id,
          mathml: mathml,
          label: param.label(setDefinition.value),
          negationLabel: param.negationLabel(setDefinition.value)
        }
      }

      question.symbols.set_members = sortingContent.createSetsMembers(question.setCategory, sortingContent.setDefinitions[question.setCategory], sets, function(truthTableRow) { 
        // 2 per segment except 0 for final (F F ... F) row of truth table
        return !!~truthTableRow.indexOf(true)
          ? 2
          : 0
      })
    },
    // autoreject, random properties, 5 sets, different values for same property
    bar: function(question) {
      if (question.setCategory != 'creature') throw new Error('Set type not supported')
      if (question.numSets != 5) throw new Error('invalid number of sets')

      var sortingContent = window.bl.contentService.tools.sorting
      var params = sortingContent.setDefinitions[question.setCategory].params

      // create sets - N.B. random params and random values
      var sets = []

      var filteredParams = params.filter(function(p) {
        return p.values.length >= question.numSets
      })

      var paramIndices = filteredParams.map(function(p, i) { return i })
      var ix = randomArrayIndex(paramIndices)
      var param = filteredParams[paramIndices[ix]]
      paramIndices.splice(ix, 1)

      var valueIndices = param.values.map(function(p, i) { return i })
      while (sets.length < question.numSets) {
        var valuesIx = randomArrayIndex(valueIndices)
        var setDefinition = {
          key: param.key,
          value: param.values[valueIndices[valuesIx]]
        }
        setDefinition.mathmlValueType = ({
          'boolean' : 'boolean',
          'number': 'cn',
          'string': 'string'
        })[ typeof setDefinition.value ]
        valueIndices.splice(valuesIx, 1);
        sets.push(setDefinition)

        var mathml = sortingContent.setTemplates.keyValue.replace(/{(.*?)}/g, function(match, pattern) {
          return setDefinition[pattern]
        })

        var id = 'set' + (sets.length - 1)
        question.symbols.sets[id] = {
          definitionURL: 'local://symbols/sets/' + id,
          mathml: mathml,
          label: param.label(setDefinition.value),
          negationLabel: param.negationLabel(setDefinition.value)
        }
      }

      question.symbols.set_members = sortingContent.createSetsMembers(question.setCategory, sortingContent.setDefinitions[question.setCategory], sets, function(truthTableRow) { 
        // 1 per segment
        return truthTableRow.filter(function (b) {
          return b;
        }).length <= 2 ? 1 : 0;
      })
    },
    // autoreject, random properties, 2 sets, all combinations intersect
    table: function(question) {
      if (question.setCategory != 'creature' && question.setCategory != 'shape') throw new Error('Set type not supported')
      if (question.numSets != 2) throw new Error('invalid number of sets')

      var sortingContent = window.bl.contentService.tools.sorting

      if (question.setCategory === 'creature' ) {
        var params = sortingContent.setDefinitions[question.setCategory].params

        // create sets - N.B. random params and random values
        var sets = []
        var paramIndices = params.map(function(p, i) { return i })
        while (sets.length < question.numSets) {
          var ix = randomArrayIndex(paramIndices)
          var param = params[paramIndices[ix]]
          paramIndices.splice(ix, 1)

          var setDefinition = {
            key: param.key,
            value: randomArrayElement(param.values)
          }
          setDefinition.mathmlValueType = ({
            'boolean' : 'boolean',
            'number': 'cn',
            'string': 'string'
          })[ typeof setDefinition.value ]
          sets.push(setDefinition)

          var mathml = sortingContent.setTemplates.keyValue.replace(/{(.*?)}/g, function(match, pattern) {
            return setDefinition[pattern]
          })

          var id = 'set' + (sets.length - 1)
          question.symbols.sets[id] = {
            definitionURL: 'local://symbols/sets/' + id,
            mathml: mathml,
            label: param.label(setDefinition.value),
            negationLabel: param.negationLabel(setDefinition.value)
          }
        }

        question.symbols.set_members = sortingContent.createSetsMembers(question.setCategory, sortingContent.setDefinitions[question.setCategory], sets, function(truthTableRow) { 
          // 2 per segment except 0 for final (F F ... F) row of truth table
          return !!~truthTableRow.indexOf(true)
            ? 2
            : 0
        })
      } else {
        var chosenKeys = []
        var shapes = sortingContent.setDefinitions[question.setCategory].options;

        while(chosenKeys.length < question.numSets) {
          var availableKeys = shapes.reduce(function(ret, shape) {
            Object.keys(shape).forEach(function(key) {
              if (key != 'name' && !~ret.indexOf(key)) {
                ret.push(key)
              }
            })
            return ret
          }, [])

          var key
          while (!key || ~chosenKeys.indexOf(key)) {
            if (chosenKeys.length < forceShapeKeys.length) {
              key = forceShapeKeys[chosenKeys.length]
            } else {
              key = randomArrayElement(availableKeys)
            }
          }
          chosenKeys.push(key)

          shapes = shapes.filter(function(shape) {
            return typeof shape[key] != 'undefined'
          })
        }

        var setDefs = chosenKeys.map(function(key) {
          var randomShape = randomArrayElement(shapes)
          var setDefinition = {
            key: key,
            value: randomShape[key]
          }
          setDefinition.mathmlValueType = ({
            'boolean' : 'boolean',
            'number': 'cn',
            'string': 'string'
          })[ typeof setDefinition.value ]
          return setDefinition
        })

        var label = sortingContent.setDefinitions[question.setCategory].label;
        setDefs.forEach(function(setDefinition, i) {
          var id = 'set' + i
          var setSymbol = {
            definitionURL: 'local://symbols/sets/' + id,
            label: label(setDefinition.key, setDefinition.value, false),
            negationLabel: label(setDefinition.key, setDefinition.value, true)
          }
          setSymbol.mathml = sortingContent.setTemplates.keyValue.replace(/{(.*?)}/g, function(match, pattern) {
            return setDefinition[pattern]
          })
          question.symbols.sets[id] = setSymbol
        })

        question.symbols.set_members = {};
        setDefs.forEach(function(setDefinition) {
          [true, false].forEach(function(bool) {
            var filteredShapes = shapes.filter(function(shape) {
              return (shape[setDefinition.key] == setDefinition.value) == bool
            })

            var numPropValueMembers = 2 + Math.floor(Math.random() * 2)
            for (var i=0; i<numPropValueMembers; i++) {
              var id = question.setCategory + Object.keys(question.symbols.set_members).length
              var member = JSON.parse(JSON.stringify(randomArrayElement(filteredShapes)))
              member.sprite = sortingContent.setDefinitions[question.setCategory].sprite(member)
              member.definitionURL = 'local://symbols/set_members/' + id
              question.symbols.set_members[id] = member
            }
          })
        })
      }
    }
  },
  createSetsMembers: function(setCategory, setCategoryDefinition, sets, numInSegmentFn) {
    var members = {}
    var truthTableRow = sets.map(function() { return true })
    var segmentsRemaining = Math.pow(2, sets.length)
    while (segmentsRemaining--) {
      var numInSegment = numInSegmentFn(truthTableRow)

      for (var i=0; i<numInSegment; i++) {
        var id = setCategory + Object.keys(members).length
        var member = {
          definitionURL: 'local://symbols/set_members/' + id
        }
        members[id] = member

        setCategoryDefinition.params.forEach(function(param) {
          for (var j=0; j<sets.length; j++) {
            if (sets[j].key == param.key) {
              set = sets[j]
              member[param.key] = truthTableRow[j]
                ? sets[j].value
                : randomArrayElement(param.values.filter(function(v) { return v != sets[j].value }))
              break
            }
          }
          if (typeof member[param.key] == 'undefined') {
            member[param.key] = randomArrayElement(param.values)
          }
        })

        member.sprite = setCategoryDefinition.sprite(member)
      }

      // next truth table row - set last occurrence of T to F, and everything after it to T
      var lastTrueIx = truthTableRow.lastIndexOf(true)
      truthTableRow = truthTableRow.map(function(value, i) {
        if (i < lastTrueIx) return value
        return i != lastTrueIx
      })
    }

    return members
  }
}

function randomArrayIndex(arr) {
  return Math.floor(Math.random() * arr.length)
}

function randomArrayElement(arr) {
  return arr[ randomArrayIndex(arr) ]
}

function pickRandomProperty(obj) {
  var result;
  var count = 0;
  for (var prop in obj) {
    if (Math.random() < 1/++count) {
      result = prop;
    }
  }
  return result;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function defineSet(param) {
}

/*
var q = contentService.question({
  tool: 'sorting',
  toolMode: 'venn',
  setCategory: 'creature',
  numSets: 3
})
console.log(JSON.stringify(q,null,2).replace(/"/g, "'").replace(/\\'/g, '"'))
//*/
var q = window.bl.contentService.question({
  tool: 'sorting',
  toolMode: 'table',
  setCategory: 'shape',
  numSets: 2
})
console.log(JSON.stringify(q,null,2).replace(/"/g, "'").replace(/\\'/g, '"'))
