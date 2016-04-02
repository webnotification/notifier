
class NotificationImage extends React.Component{
    render(){
        return(
            <div>
                <img className="notif-img" src={this.props.image}></img>
            </div>
        );
    }
}

export default NotificationImage;
