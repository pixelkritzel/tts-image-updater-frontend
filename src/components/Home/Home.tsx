import React from 'react';
import { observer } from 'mobx-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Fab, Grid, styled } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { StoreContext } from 'components/StoreContext';
import { ImageSetPreview } from 'components/ImageSetPreview';

const AddButton = styled(Fab)({
  position: 'fixed',
  bottom: '1.5vh',
  right: '1.5vh',
});

interface HomeProps extends RouteComponentProps {}

@observer
class HomeComponent extends React.Component<HomeProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  onNewImageSet = async () => {
    const imageSetId = await this.context.user!.newImageSet();
    this.props.history.push(`image-sets/${imageSetId}`);
  };

  render() {
    const { user } = this.context;

    if (!user) return null;

    return (
      <>
        <h1>Hi {user.name}!</h1>
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
        <AddButton color="primary" variant="extended" onClick={this.onNewImageSet}>
          <AddIcon /> Add image set
        </AddButton>
      </>
    );
  }
}

export const Home = withRouter(HomeComponent);
