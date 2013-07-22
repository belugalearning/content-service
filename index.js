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
              <string>{value}</string>\
            </eq>\
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
          <csymbol definitionURL="local://sets/unclassified"/>\
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
          value: randomArrayElement(param.values)
        }
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

/*
var q = contentService.question({
  tool: 'sorting',
  toolMode: 'venn',
  setCategory: 'creature',
  numSets: 3
})
console.log(JSON.stringify(q,null,2).replace(/"/g, "'").replace(/\\'/g, '"'))
//*/
