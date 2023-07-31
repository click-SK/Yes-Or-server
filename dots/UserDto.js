export const createUserDto = (model) => {
    const { email, _id } = model;

    return {
        email,
        id: _id.toString()
    };
}