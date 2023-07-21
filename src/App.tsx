// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useState} from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: any
};

interface IButtonProps {
  onClick: any;
}

const Button: React.FC<IButtonProps> = ({onClick}) =>  {
  return (
      <button type="button" onClick={onClick}>
        get random user
      </button>
  );
}

/*type UserInfoPropsType = {
  user: User;
}*/

/*const UserInfo:React.FC<UserInfoPropsType> = ({ user }) => {
  return (
      <table>
        <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.phone}</td>
        </tr>
        </tbody>
      </table>
  );
}*/

const App: React.FC = () => {
  const [item, setItem] = useState<User | null> (null);
  console.log(item)

  const receiveRandomUser = async () => { // асинхронная функция получения случайного пользователя
    const id = Math.floor(Math.random() * (10 - 1)) + 1; // случайное число от 1 до 10
    const response = await fetch(`${URL}/${id}`); //получить ответ от сервера по пользователю со случайным номером
    const _user: User  = await response.json(); // преобразовать ответ в json формат
    setItem(_user); // записать ответ в локальный стейт
  };

  const handleButtonClick = () => { // обработчик нажатия на кнопку
    receiveRandomUser(); // запустить получение случайного пользователя и запись в локальный стейт
  };
  return (
      <div>
        <header>Get a random user</header>
        <Button onClick={handleButtonClick} /> {/*кнопка с обработчиком на получение случайного пользователя и запись в стейт*/}
       {/* <UserInfo user={item} />*/}
      </div>
  );
}

export default App;