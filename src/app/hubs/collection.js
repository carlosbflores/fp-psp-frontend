import Bn from 'backbone';
import { includes } from 'lodash';
import env from '../env';

const Collection = Bn.Collection.extend({
  url: `${env.API}/applications`,
  filterByValue(term) {
    const filtered = this.filter(m => this.includesAny(term, m));

    return new Collection(filtered);
  },
  includesAny(term, model) {
    return (
      includes(model.get('name'), term) ||
      includes(model.get('code'), term) ||
      includes(model.get('description'), term) ||
      includes(model.get('information'), term)
    );
  }
});

export default Collection;
