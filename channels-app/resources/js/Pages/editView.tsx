import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface EditChannelProps {
  channel: any;
}

//Początkowe wartości dla pól
const EditChannel = ({ channel }: EditChannelProps) => {
  const [inputData, setInputData] = useState({
    name: '',
    customers: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  //Aktualizacja formularza na podstawie przesłanych danych od Laravel
  useEffect(() => {
    if (channel) {
      setInputData((prevData) => ({
        ...prevData,
        name: channel.name,
        customers: channel.customers,
      }));
    }
  }, [channel]);

  //Pobieramy warości z formularza od urzytkownika
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Obsługa wysyłania danych
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Wysłanie zaktualizowanych danych do Laravela przez PUT
    axios
      .put(`/kanal/zmien/${channel.id}`, inputData)
      .then((response) => {
        setSuccessMessage('Kanał został pomyślnie zaktualizowany');
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.response && error.response.status === 422) {
          setError('Podana nazwa kanału już istnieje');
        } else {
          console.error(error);
        }
      });
  };

  const handleGoBack = () => {
    window.location.href = `/`;
  };

  //Jeśli nie ma przesłanych danych zwraca null
  if (!channel) {
    return null;
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className='formContainer'>
        <h2>Edytuj kanał {channel.name}</h2>
        <div className='inputContainer'>
          <label htmlFor="name">Nazwa: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={inputData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputContainer'>
          <label htmlFor="customers">Ilość użytkowników: </label>
          <input
            type="number"
            id="customers"
            name="customers"
            value={inputData.customers}
            onChange={handleInputChange}
          />
        </div>
        <div className='buttonContainer'>
          <button type="submit">Zaktualizuj</button>
          <button onClick={handleGoBack}>Wróć</button>
        </div>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default EditChannel;
