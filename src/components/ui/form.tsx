type CustomForm = Omit<React.ComponentProps<'form'>, 'id'>;

interface FormProps extends CustomForm {
    id: string;
}

const Form = (props: FormProps) => {
    return <form {...props} />;
};

export { Form };
