import './App.css';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  name: yup.string().min(1).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/, { message: "Password should be stronger" })
})

const initState = {
  name: '',
  email: '',
  password: ''
}

function App() {
  const [toggle, setToggle] = useState('user');
  const formRef = useRef(null);
  const [formState, setFormState] = useState({
    user: initState,
    manager: initState
  })

  const handleToggle = () => {
    if (toggle === 'user') {
      setToggle('manager')
      const userData = formRef.current.getFormState();
      setFormState({
        ...formState,
        user: userData
      })
    }

    else {
      setToggle('user')
      const userData = formRef.current.getFormState();
      setFormState({
        ...formState,
        manager: userData
      })
    }


    formRef.current.reset();

  }


  return (
    <div className="App">
      <div>
        Current User: {toggle}
        <button type="button" onClick={handleToggle}>Change User</button>
      </div>
      <LoginForm ref={formRef} defaultValue={toggle === 'user' ? formState.user : formState.manager} />
    </div>
  );
}

export default App;


const LoginForm = React.forwardRef(({ defaultValue }, ref) => {


  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
    values: defaultValue
  })


  const onSubmit = (data) => {
    reset();
  };

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
    getFormState() {
      return {
        email: getValues('email'),
        password: getValues('password'),
        name: getValues('name')
      };
    }
  }));


  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex' }}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => <input type="text" {...field} />}
        style={{ flexDirection: 'column' }}
      />
      {errors?.name && <p>Name is not Valid</p>}
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => <input type="email" {...field} />}
      />
      {errors?.email && <p>Email is not Valid</p>}
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => <input type='password' {...field} />}
      />
      {errors?.password && <p>Password is not Valid</p>}
      <input type="submit" disabled={Object.keys(errors).length > 0} />
    </form>
  )

});
