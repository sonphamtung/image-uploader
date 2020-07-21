import React from 'react';
import { storiesOf } from '@storybook/react';

import ImageUpload from '../src/ImageUpload';
import './ImageUploadStyles.scss';

storiesOf('ImageUpload', module).add('default', () => (
    <div style={{ margin: '30px' }}>
        <ImageUpload upload={() => Promise.resolve({ url: '123' })} removeElement={<span className="action-button">Remove</span>}>
            <span className="action-button">Upload Button</span>
        </ImageUpload>
    </div>
));
