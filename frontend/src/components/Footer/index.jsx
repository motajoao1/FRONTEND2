import './styles.css';

function Footer() {
    return (
        <footer className="footer-container"> 
            <p>&copy; {new Date().getFullYear()} - SENAI Dendezeiros</p>
        </footer>
    )
}

export default Footer;