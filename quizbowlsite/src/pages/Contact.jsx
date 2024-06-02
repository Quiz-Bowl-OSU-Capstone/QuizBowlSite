
export function Contact() {
  // Styling for the contact information is somewhat contained here.
  const contactStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const listItemStyle = {
    textAlign: 'center',
  };

  const organizationInfoStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  };

  // All stored here, no dynamic updates needed.
  return (
    <div>
      
      <ul style={contactStyle}>
        <li style={listItemStyle}>
          <div>
            <strong>Name:</strong> Aura Fairchild <br />
            <strong>Email:</strong> fairchau@oregonstate.edu
          </div>
        </li>
        <li style={listItemStyle}>
          <div>
            <strong>Name:</strong> Ricardo Gonzalez <br />
            <strong>Email:</strong> gonzalri@oregonstate.edu
          </div>
        </li>
        <li style={listItemStyle}>
          <div>
            <strong>Name:</strong> Jay Shah <br />
            <strong>Email:</strong> shahj@oregonstate.edu
          </div>
        </li>
        <li style={listItemStyle}>
          <div>
            <strong>Name:</strong> Daksh Viradiya <br />
            <strong>Email:</strong> viradiyd@oregonstate.edu
          </div>
        </li>
      </ul>
      <br/>

    
      <div style={organizationInfoStyle}>
        <h3><strong>Organization Information:</strong></h3>
        <p>4H Oregon Quiz Bowl - Oregon State Exntension</p>
        <p>Project Partner: Candi Bothum</p>
        <p>Email: candi.bothum@oregonstate.edu</p>
      </div>

      <div style={organizationInfoStyle}>
        <h3><strong>Oregon State IT Support</strong></h3>
        <p>Information Technology Help:</p>
        <p>Phone Number: 541-737-8787</p>
        <p>Email: coe.support@oregonstate.edu</p>
        <p>Link: https://it.engineering.oregonstate.edu/contacting-helpdesk</p>
        <p>*Please contact Engineering Information Technology for assistance using either the online support portal at https://support.engineering.oregonstate.edu </p>
        <p>*Live, in-person technical assistance for undergraduates, is available at the OSU Service Desk located in Milne Hall.</p>
      </div>
    </div>
  );
}

