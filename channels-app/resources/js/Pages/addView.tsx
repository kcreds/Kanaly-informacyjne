import React, { useState } from 'react';
import axios from 'axios';

//Opisujemy dane wejściowe
interface InputData {
    name: string;
    customers: string;
}

const AddChannel = () => {
    //Początkowe wartości dla pól do przesłania
    const [inputData, setInputData] = useState<InputData>({
        name: '',
        customers: '',
    });

    //Definujemy stan errors oraz successMessage
    const [errors, setErrors] = useState<any>({});
    const [successMessage, setSuccessMessage] = useState('');

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

        // Wysyłanie danych do Laravela przez POST
        axios
            .post('/kanal/zapisz', inputData)
            .then((response) => {
                setSuccessMessage('Kanał zostały pomyślnie dodany');
            })
            .catch((error) => {
                // Obsługa błędu
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error(error.message);
                }
            });
    };

    const handleGoBack = () => {
        window.location.href = `/`;
    };

    //Zwracamy kod HTML 
    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className='formContainer'>
                <h2>Dodaj nowy kanał</h2>
                <div className='inputContainer'>
                    <label htmlFor="name">Nazwa: </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={inputData.name}
                        onChange={handleInputChange}
                    /><br />
                    {errors.name && <span>{errors.name[0]}</span>}
                </div>
                <div className='inputContainer'>
                    <label htmlFor="customers">Ilość użytkowników: </label>
                    <input
                        type="number"
                        id="customers"
                        name="customers"
                        required
                        value={inputData.customers}
                        onChange={handleInputChange}
                    />
                    {errors.customers && <span>{errors.customers[0]}</span>}
                </div>
                {/* Dodaj tutaj inne pola formularza */}
                <div className='buttonContainer'>
                    <button type="submit">Dodaj</button>
                    <button onClick={handleGoBack}>Wróć</button>
                </div>
                {successMessage && <p>{successMessage}</p>}
            </form>

        </div>
    );
};

export default AddChannel;
