// export function Contact() {
//   return (
//     <h3>
//       <ul>
//         <li>Aura Fairchild</li>
//         <li>Ricardo Gonzalez</li>
//         <li>Jay Shah</li>
//         <li>Daksh Viradiya</li>
//       </ul>
//     </h3>
//   );
// }
export function Contact() {
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
    </div>
  );
}

