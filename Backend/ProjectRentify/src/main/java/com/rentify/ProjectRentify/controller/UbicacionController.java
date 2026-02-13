package com.rentify.ProjectRentify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.rentify.ProjectRentify.entity.Ubicacion;
import com.rentify.ProjectRentify.service.PaisService;
import com.rentify.ProjectRentify.service.UbicacionService;

@Controller
@RequestMapping("/ubicacion")//Este es como se llama el html si no me equivoco
public class UbicacionController {
	
	@Autowired
    private UbicacionService ubicacionService;

    @Autowired
    private PaisService paisService; // Para llenar el combo de países

    // Listar todas las ubicaciones
    @GetMapping
    public String listarUbicaciones(Model model) {
        model.addAttribute("ubicaciones", ubicacionService.listarTodos());
        return "listarUbicacion"; //html
    }

    // Mostrar formulario de nueva ubicación
    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("ubicacion", new Ubicacion());
        model.addAttribute("paises", paisService.listarTodos()); // lista de países
        model.addAttribute("titulo", "Nueva Ubicación");
        return "formularioUbicacion"; //html
    }

    // Guardar nueva o editar existente
    @PostMapping("/guardar")
    public String guardarUbicacion(@ModelAttribute Ubicacion ubicacion, RedirectAttributes redirectAttributes) {
        try {
            boolean esNuevo = (ubicacion.getId() == null);
            ubicacionService.guardar(ubicacion);

            if (esNuevo) {
                redirectAttributes.addFlashAttribute("mensaje", "Ubicación registrada correctamente.");
            } else {
                redirectAttributes.addFlashAttribute("mensaje", "Ubicación actualizada correctamente.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ocurrió un error al guardar la ubicación.");
        }
        return "redirect:/ubicacion"; //html
    }

    // Editar una ubicación existente
    @GetMapping("/editar/{id}")
    public String editarUbicacion(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Ubicacion ubicacion = ubicacionService.buscarPorId(id);
        if (ubicacion == null) {
            redirectAttributes.addFlashAttribute("error", "La ubicación no existe.");
            return "redirect:/ubicacion"; //html
        }
        model.addAttribute("ubicacion", ubicacion);
        model.addAttribute("paises", paisService.listarTodos());
        model.addAttribute("titulo", "Editar Ubicación");
        return "formularioUbicacion"; //html
    }

    // Eliminar ubicación
    @GetMapping("/eliminar/{id}")
    public String eliminarUbicacion(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            ubicacionService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Ubicación eliminada correctamente.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ocurrio un error al intentar borrar esta ubicacion.");
        }
        return "redirect:/ubicacion"; //html
    }

}
