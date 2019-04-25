export const  SectionMixin = {
  methods: {
    calculateOpennedAlias(route) {
      let sections = this.$store.getters.getSections;
      for (let i in sections)
      {
        if (sections[i].alias === route) {
          return sections[i].alias;
        }

        if (sections[i].items.length) {
          for (let j in sections[i].items)
          {
            if (sections[i].items[j].alias === route) {
              return sections[i].alias;
            }
          }
        }
      }
    }
  }
};
