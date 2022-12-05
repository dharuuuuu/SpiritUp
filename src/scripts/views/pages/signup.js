/* eslint-disable camelcase */
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
    getDatabase, set, ref,
} from 'firebase/database';
import Swal from 'sweetalert2';
import firebaseConfig from '../../data/config';
import '../component/headerNav';

const signup = {
    async render() {
        return `
        <header-nav></header-nav>
        <main tabindex="0" id="mainContent">
        <div class="signup_header">SPIRITUP</div>
        <div class="signup_box">
        <h1>Sign Up</h1>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Nama Lengkap" required><br>
        <label for="signupEmail">E-mail</label>
        <input type="text" id="signupEmail" name="signupEmail" placeholder="E-mail" required><br>
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword" name="signupPassword" placeholder="Password" required><br>
        <label for="signupPasswordConfirm">Confirm Password</label>
        <input type="password" id="signupPasswordConfirm" name="signupPasswordConfirm" placeholder="Confirm Your Password" required>
        <input type="checkbox" id="toogle_password" class="toogle_password">Show Password
        <input type="submit" id="signup" name="signup" value="Sign Up">
        </div>
        </main>
    `;
    },
    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase(app);
        const signupButton = document.getElementById('signup');

        signupButton.addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const emailSignup = document.getElementById('signupEmail').value;
            const passwordSignup = document.getElementById('signupPassword').value;
            const signupPasswordConfirm = document.getElementById('signupPasswordConfirm').value;

            if (passwordSignup !== signupPasswordConfirm) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Passwords did not match',
                });
            } else {
                createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
                    .then((userCredential) => {
                        // Signed in
                        const { user } = userCredential;

                        set(ref(database, `users/${user.uid}`), {
                            name,
                            email: emailSignup,
                        })
                            .then(() => {
                                Swal.fire({
                                    title: 'Sign Up Success',
                                    text: 'Akun berhasil dibuat',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'OK',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.replace('#/login');
                                    }
                                });
                            })
                            .catch((error) => {
                                // the write failed
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: error,
                                });
                            });
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errorMessage,
                        });
                    });
            }
        });

        const toogle_password = document.getElementById('toogle_password');
        const signupPassword = document.getElementById('signupPassword');
        const signupPasswordConfirm = document.getElementById('signupPasswordConfirm');
        toogle_password.addEventListener('click', () => {
            if (signupPassword.type === 'password') {
                signupPassword.type = 'text';
            } else {
                signupPassword.type = 'password';
            }

            if (signupPasswordConfirm.type === 'password') {
                signupPasswordConfirm.type = 'text';
            } else {
                signupPasswordConfirm.type = 'password';
            }
        });
    },

};

export default signup;
