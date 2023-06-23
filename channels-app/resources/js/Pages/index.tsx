import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';

//Opisujemy strukturę danych pojedynczego kanału
interface Channel {
  id: number;
  name: string;
  customers: number;
}

//Opisujemy strukturę zmiennej z danymi z bazy
interface ListProps {
  channels: Channel[];
}

//
const List: React.FC<ListProps> = ({ channels }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, [reloadPage]);

  //Definiuje funkcję, która asynchronicznie pobiera listę kanałów
  const fetchChannels = async () => {
    try {
      const response = await axios.get('/');
    } catch (error) {
      console.log(error);
    }
  };

  //Losujemy kolor dla wykresu kołowego
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  //Obsługa przycisku edytuj
  const handleEdit = async (channel: Channel) => {
    try {
      const response = await axios.get(`/kanal/edytuj/${channel.id}`);
      window.location.href = `/kanal/edytuj/${channel.id}`;
    } catch (error) {
      console.log(error);
    }
  };

  //Obsługa przycisku usuń
  const handleDelete = async (channel: Channel) => {
    try {
      const response = await axios.delete(`/kanal/usun/${channel.id}`);
      setSuccessMessage(response.data.message);
      setReloadPage(true);
    } catch (error) {
      console.log(error);
    }
  };

  //Obsługa przycisku dodaj
  const handleAdd = async () => {
    window.location.href = `/kanal/dodaj`;
  };

// Alert o sukcesie po usunięciu
  useEffect(() => {
    if (successMessage) {
      
      alert(successMessage);
      setSuccessMessage('');
    }
  }, [successMessage]);

// Przeładuj stronę po pomyślnym usunięciu
  useEffect(() => {
    if (reloadPage) {
      
      window.location.reload();
      setReloadPage(false);
    }
  }, [reloadPage]);

  return (
    <div>
      <div className="tableDiv">
        <button className="add-button" onClick={() => handleAdd()}>Dodaj kanał</button>
        <table>
          <thead>
            <tr>
              <th>Kanał</th>
              <th>Użytkownicy</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.id}>
                <td>{channel.name}</td>
                <td>{channel.customers}</td>
                <td>
                  <button onClick={() => handleEdit(channel)}>Edytuj</button>
                  <button className="delete-button" onClick={() => handleDelete(channel)}>Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Array.isArray(channels) && channels.length > 0 ? (
        <div>
          <PieChart
            data={channels.map((channel) => ({
              title: channel.name,
              value: channel.customers,
              color: getRandomColor(),
            }))}
            lineWidth={100}
            radius={30}
            label={({ dataEntry }) => `${dataEntry.title} (${((dataEntry.value / channels.reduce((acc, channel) => acc + channel.customers, 0)) * 100).toFixed(2)}%)`}
            labelPosition={110}
            labelStyle={{
              fontSize: '1.5px',
              fontWeight: 'bold',
            }}
          />
        </div>
      ) : (
        <p>Brak danych</p>
      )}
    </div>
  );
};

export default List;
