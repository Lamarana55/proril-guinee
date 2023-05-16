package com.mady.backend.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import javax.mail.internet.MimeMessage

@Service
class SendMailService {
    @Autowired
    private val javaMailSender: JavaMailSender? = null

    fun SendEmail(to: String, subject: String, body: String) {
        println("Envoi du mail....................")
        val simpleMailMessage = SimpleMailMessage()
        simpleMailMessage.setFrom("anien.dev@gmail.com")
        simpleMailMessage.setTo(to, "lamarana55@gmail.com")
        simpleMailMessage.setSubject(subject)
        simpleMailMessage.setText(body)
        javaMailSender!!.send(simpleMailMessage)
        println("Mail envoyer...................")

    }


    fun sendEmailHtml(nom: String, email: String, username: String, password: String, lien: String) {
        println("Sending mail.................!")
        var message: MimeMessage = javaMailSender!!.createMimeMessage()
        var helper = MimeMessageHelper(message, true)
        helper.setFrom("anien.dev@gmail.com")
        helper.setTo(arrayOf("lamarana55@gmail.com", email))
        helper.setCc(arrayOf("ande.developper@gmail.com", "anien.dev@gmail.com", "alerte.vbg.guinee@gmail.com"))
        helper.setSubject("Identifiant de connexion sur l'application")
        helper.setText(body(nom, username, password, lien), true)
        javaMailSender.send(message)
        println("Mail envoyé...................")

    }

    fun sendEmailHtmlReset(nom: String, email: String, lien: String) {
        println("Sending mail reset password.................!")
        var message: MimeMessage = javaMailSender!!.createMimeMessage()
        var helper = MimeMessageHelper(message, true)
        helper.setFrom("anien.dev@gmail.com")
        helper.setTo(arrayOf("lamarana55@gmail.com", email))
        helper.setCc(arrayOf("ande.developper@gmail.com", "anien.dev@gmail.com", "alerte.vbg.guinee@gmail.com"))
        helper.setSubject("Lien pour réinitialiser votre mot de passe")
        helper.setText(bodyResetPassword(nom, lien), true)
        javaMailSender.send(message)
        println("Mail reset envoyé...................")

    }

    fun sendEmailHtmlPasswordGenerate(nom: String, email: String, username: String, password: String, lien: String) {
        println("Sending mail generate password.................!")
        var message: MimeMessage = javaMailSender!!.createMimeMessage()
        var helper = MimeMessageHelper(message, true)
        helper.setFrom("anien.dev@gmail.com")
        helper.setTo(arrayOf("lamarana55@gmail.com", email))
        helper.setCc(arrayOf("ande.developper@gmail.com", "anien.dev@gmail.com"))
        helper.setSubject("Nouveau mot de passe")
        helper.setText(bodyGeneratePassword(nom, username, password, lien), true)
        javaMailSender.send(message)
        println("Mail generate password envoyé...................")

    }

    fun body(nom: String, username: String, password: String, lien: String): String {
        return """
        <h1>Bonjour $nom,</h1>
        <h2>Nous vous informons que vos identifiants sont les suivantes : </h2>
        <h2>Lien du site : <strong><a href=$lien>cliquez ici</a></strong> </h2>
        <h2>Login: <strong>$username </strong> </h2>
        <h2>Mots de pass: <strong> $password </strong> </h2>
        
        <p><h2>L'équipe <a target="_blank" rel="noopener noreferrer" href="https://feltech.tech/" >FEL-TECH</a> </h2></p>
        
    """.trimIndent()
    }

    fun bodyResetPassword(nom: String, lien: String): String {
        return """
        <h1>Bonjour Mr/Mme $nom,</h1>
        <p><h3>Vous avez demandé la réinitialisation de votre mot de passe.</h3></p> 
        <p><h3>Cliquez sur le lien ci-dessous pour modifier votre mot de passe</h3></p> 
        <p><h3><strong><a href=$lien>changer le mot de pass</a></strong></h3></p>
        <p><h3>NB: le lien expire dans 30 minutes </h3></p>
        <p><h3>Si vous ne souhaitez pas réinitialiser votre mot de passe, ignorez cet e-mail et aucune action ne sera entreprise</h3></p>
        
        <p><h2>L'équipe <a target="_blank" rel="noopener noreferrer" href="https://feltech.tech/" >FEL-TECH</a> </h2></p>

        
    """.trimIndent()
    }


    fun bodyGeneratePassword(nom: String, username: String, password: String, lien: String): String {
        return """
        <h1>Bonjour $nom,</h1>
        <h2>Nous vous informons que votre mots de passe a été renitialisé, les accès sont les suivantes : </h2>
        <h2>Lien du site :<strong><a href=$lien>cliquez ici</a></strong> </h2>
        <h2>Login: <strong>$username </strong> </h2>
        <h2>Nouveau mots de pass: <strong> $password </strong> </h2>
        
        <p><h2>L'équipe <a target="_blank" rel="noopener noreferrer" href="https://ande.gov.gn/" >ANDE</a> </h2></p>
    """.trimIndent()
    }

}

