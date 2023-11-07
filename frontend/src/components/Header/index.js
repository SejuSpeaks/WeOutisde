import Navigation from "../Navigation";

const Header = ({ isLoaded }) => {

    const onClick = () => {
        console.log('clicked');
    }

    return (
        <div>
            <h1>WeOutside</h1>
            <Navigation />
        </div>
    )
}

export default Header;
