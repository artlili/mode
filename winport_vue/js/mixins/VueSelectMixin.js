export const VueSelectMixin = {
  methods: {
    /**
     * Get id from single option value
     *
     * @param option
     * @returns {null}
     */
    optionToId(option) {
      return option.name ? option.name : null;
    },

    /**
     * Get selected option object based on id
     *
     * @param id
     * @param options
     * @returns {*}
     */
    idToOption(id, options) {
      if (!id) {
        return null;
      }

      for (let i in options) {
        if (id.toString() === options[i]['name']) {
          return options[i];
        }
      }

      return null;
    },

    /**
     * Get id list from selected options
     *
     * @param options
     * @returns {Array}
     */
    optionsToIds(options) {
      let ids = [];
      if (!options.length) {
        return [];
      }

      for (let i in options) {
        ids.push(options[i]['name']);
      }

      return ids;
    },

    /**
     * Get options based on incoming ids
     *
     * @param ids
     * @param options
     */
    idsToOptions(ids, options) {
      let output = [];

      for (let i in ids) {
        for (let j in options) {
          if (ids[i].toString() === options[j]['name'].toString()) {
            output.push(options[j]);
            break;
          }
        }
      }

      return output;
    }
  }
};
