import glob from 'glob';
import _ from 'lodash';
import path from 'path';

class FlowRequireManager {

  constructor(settings) {
    this.settings = settings || {};
    this.items = {};
  }

  log(level, message) {
    if (this.settings.logger) {
      this.settings.logger.log(level, message);
    }
  }

  getAbsolutePath(relative) {
    return path.normalize(path.join(process.cwd(), relative));
  }

  addItem(item) {
    this.log('info', `Adding item ${item.name}`);
    this.items[item.name] = item;
  }

  removeItem(name) {
    this.log('info', `Removing item ${name}`);
    delete this.cards[name];
  }

  getItem(name) {
    return this.items[name];
  }

  addFolder(folder, cb) {
    glob(folder+'/'+this.settings.pattern, {}, function(err, files) {
      if (err) {
        return cb(err);
      }
      for (let i = 0; i < files.length; i++) {
        let content = require(this.getAbsolutePath(files[i]));
        if (content) {
          if (!_.isArray(content)) {
            if (!content.name) {
              let extension = path.extname(files[i]);
              content.name = path.basename(files[i], extension).toLowerCase();
            }
            content = [content];
          }
          for (let j = 0; j < content.length; j++) {
            this.addItem(content[j]);
          }
        } else {
          this.log('warning', `Content not found for file ${files[i]}`);
        }
      }
    }.bind(this));
  }
}

export default FlowRequireManager;
