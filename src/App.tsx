//+ Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
//+ Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
//+ Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useCallback, useState, useEffect} from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = { // тип компании
    bs: string;
    catchPhrase: string;
    name: string;
};

type User = { // тип пользователя
    id: number;
    email: string;
    name: string;
    phone: string;
    username: string;
    website: string;
    company: Company;
    address: any
};

type ButtonPropsType = {
    disabled: boolean
    onClick: () => void;
}

const Button: React.FC<ButtonPropsType> = React.memo(({onClick, disabled}) => { // компонента кнопки, принимает обработчик нажатия на кнопку и маркер disabled
    console.log("Button") // проверка количества ререндеров компоненты
    return (
        <button type="button" onClick={onClick} disabled={disabled}>
            get random user
        </button>
    );
})

type UserInfoPropsType = {
    user: User; // тип принимаемых пользователей
}

const UserInfo: React.FC<UserInfoPropsType> = React.memo(({user}) => { // компонента вывода данных по пользователю
    console.log("UserInfo") // проверка количества ререндеров компоненты
    const {name, phone} = user // получение данных пользователя из пропсов и последующая отрисовка
    return <div>
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Phone number</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{name}</td>
                <td>{phone}</td>
            </tr>
            </tbody>
        </table>
    </div>
})
const App: React.FC = () => {
    console.log("App") // проверка количества ререндеров компоненты
    const [item, setItem] = useState<User | null>(null); // локальный стейт по пользователю (изначально занулен)
    const [isFetching, setIsFetching] = useState(false) // флаг загрузки (для disable кнопки)

    useEffect(() => {
        if (isFetching) { // если кнопка нажата
            const clearId = setTimeout(() => { // задержка для disable кнопки
                receiveRandomUser(); // асинхронная функция получения случайного пользователя и запись в локальный стейт
            }, 500)
            return () => {
                clearTimeout(clearId) // зачистка утечки памяти
            }
        }
    }, [isFetching])

    const receiveRandomUser = async () => { // асинхронная функция получения случайного пользователя
        const id = Math.floor(Math.random() * (10 - 1)) + 1; // случайное число от 1 до 10
        const response = await fetch(`${URL}/${id}`); //получить ответ от сервера по пользователю со случайным номером
        const user: User = await response.json(); // преобразовать ответ в json формат
        if (user) {
            setItem(user)
            setIsFetching(false) // после disable с кнопки снимается
        }
        ;  // если пришли данные по пользователю с сервера, записать ответ в локальный стейт
    };

    const handleButtonClick = useCallback(() => { // обработчик нажатия на кнопку, обернули в useCallback чтобы не рисовалась лишний раз Button при возможных ререндаерах родителя
        console.log("==================================") // начало цикла ререндера при нажатии на кнопку
        setIsFetching(true) // задать флаг загрузки в true для disable кнопки
    }, [])
    return (
        <div>
            {/*заголовок*/}
            <header>Get a random user</header>
            <Button
                disabled={isFetching} // флаг для disable кнопки в момент загрузки и задержки между загрузками 500мс
                onClick={handleButtonClick}/> {/*кнопка с обработчиком на получение случайного пользователя и запись в стейт*/}
            {item && <UserInfo user={item}/>} {/* вывод данных по пользователю только когда они не нулевые*/}
        </div>
    );
}

export default App;