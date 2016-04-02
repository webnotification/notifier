import Dropzone from 'react-dropzone';
import request from 'superagent';
import {CircularProgress, Snackbar, RaisedButton} from 'material-ui'; 
import config from './../../../../server/config/dashboard_config'

class FileSelector extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: false, snackbar_open: false, image_status: "" };
    };

    onImageUpload(err, res){
        this.setState({loading: false});
        if(!err && JSON.parse(res.text).success === true)
            this.props.onImageUpload();
        else
            this.setState({snackbar_open: true, image_status: config.IMAGE_SIZE_ERROR_MSG});
    };

    onDrop(files) {
        this.setState({loading: true});
        request.post('/api/image/upload')
            .attach('userPhoto', files[0])
            .end(this.onImageUpload.bind(this));
    };

    handleRequestClose(){
        this.setState({snackbar_open: false});
    };

    render(){
        let progress_state = (
            this.state.loading ? <CircularProgress mode='indeterminate' size={0.75}/>:
            <RaisedButton label="Upload Image" secondary={true}/>
        );
        let dropzone_style = {};
        return(
            <div>
                <Dropzone onDrop={this.onDrop.bind(this)} style={dropzone_style}>
                    {progress_state}
                </Dropzone>
                <Snackbar
                  open={this.state.snackbar_open}
                  message={this.state.image_status}
                  autoHideDuration={2000}
                  onRequestClose={this.handleRequestClose.bind(this)}
                />
            </div>
        );
    }
}

export default FileSelector;
