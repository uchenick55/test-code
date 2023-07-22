//+ Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
//+ Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
//+ Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useCallback, useState, useEffect, useRef} from "react";

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

interface ButtonPropsType {
    onClick: () => void;
}

const Button: React.FC<ButtonPropsType> = React.memo( ({onClick}) => { // компонента кнопки, принимает обработчик нажатия на кнопку
    console.log("Button")
    return (
        <button type="button" onClick={onClick}>
            get random user
        </button>
    );
})

type UserInfoPropsType = {
    user: User | null; // тип принимаемых данных
}

const UserInfo: React.FC<UserInfoPropsType> = React.memo( ({user}) => { // компонента вывода данных по пользователю
    console.log("UserInfo")
    // вывод данных пользователя только если они не нулевые
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
                <td>{user?.name}</td>
                <td>{user?.phone}</td>
            </tr>
            </tbody>
        </table>
    </div>
})
function useThrottle<T>(value: T, interval = 500): T { // функция хук тротлинга
    const [throttledValue, setThrottledValue] = useState<T>(value) // текущее возвращаемое значение после тротлинга
    const lastExecuted = useRef<number>(Date.now()) // предыдущее время возврата после тротлинга

    useEffect(() => {
        if (Date.now() >= lastExecuted.current + interval) { // если прошло больше времени задержки после тротлинга
            lastExecuted.current = Date.now() // перезаписываем последнее время возврата тротлинга
            setThrottledValue(value) // записываем в возвращаемов значение текущее значение value
        } else { // если времени еще не прошло достаточно после крайнего тротлинга
            const timerId = setTimeout(() => { //запускаем таймаут с задержкой
                lastExecuted.current = Date.now() // по истечению перезаписываем последнее время возврата тротлинга
                setThrottledValue(value)// записываем в возвращаемов значение текущее значение value
            }, interval)

            return () => clearTimeout(timerId) // зачищаем утечку памяти по таймауту
        }
    }, [value, interval])

    return throttledValue // вернуть входное значение если прошла задержка трротлинга
}

const App: React.FC = () => {
    console.log("App")
    const [item, setItem] = useState<User | null>(null); // локальный стейт по пользователю (изначально занулен)
    const [value, setValue] = useState("hello!")
    const throttledValue = useThrottle(value)

    useEffect(() => console.log(`throttledValue changed: ${throttledValue}`), [
        throttledValue,
    ])
    const receiveRandomUser = async () => { // асинхронная функция получения случайного пользователя
        const id = Math.floor(Math.random() * (10 - 1)) + 1; // случайное число от 1 до 10
        const response = await fetch(`${URL}/${id}`); //получить ответ от сервера по пользователю со случайным номером
        const user: User = await response.json(); // преобразовать ответ в json формат
        user && setItem(user); // записать ответ в локальный стейт
    };

    const handleButtonClick = useCallback( () => { // обработчик нажатия на кнопку
        receiveRandomUser(); // асинхронная функция получения случайного пользователя и запись в локальный стейт
    },[])
    return (
        <div>
            {/*заголовок*/}
            <header>Get a random user</header>
            <input value={value} onChange={(event)=>setValue(event.target.value)}/>
            <Button
                onClick={handleButtonClick}/> {/*кнопка с обработчиком на получение случайного пользователя и запись в стейт*/}
            {<UserInfo user={item}/>} {/* вывод данных по пользователю только когда они не нулевые*/}
        </div>
    );
}

export default App;