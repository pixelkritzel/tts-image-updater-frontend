import React from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';
import { ImageSetPreview } from 'components/ImageSetPreview';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface HomeProps {}

@observer
export class Home extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    const { user } = this.context;

    if (!user) return null;

    return (
      <>
        <h1>Hi, {user.name}</h1>
        <p>This are your image sets</p>
        <Grid container spacing={3}>
          {user.imageSetsAsArray.map((imageSet) => (
            <Grid item key={imageSet.id} md={3} xs={12}>
              <Link to={`/image-sets/${imageSet.id}`}>
                <ImageSetPreview imageSet={imageSet} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}
