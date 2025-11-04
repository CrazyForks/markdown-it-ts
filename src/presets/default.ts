// markdown-it default options

const defaultPreset = {
  options: {
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
    quotes: '\u201C\u201D\u2018\u2019', /* ""'' */
    highlight: null,
    maxNesting: 100,
  },
  components: {
    // Empty components means all rules are enabled by default
    core: {},
    block: {},
    inline: {},
  },
}

export default defaultPreset
